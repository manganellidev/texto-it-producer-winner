import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Studio } from '../entities/studio.entity';
import { Producer } from '../entities/producer.entity';
import { Award } from '../entities/award.entity';
import { Movie } from '../entities/movie.entity';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import { join } from 'path';
import { createId } from '@paralleldrive/cuid2';

type CsvData = {
  year: number;
  movieTitle: string;
  studioName: string;
  producerName: string;
  isWinner: boolean;
};

type MovieCreate = {
  id: string;
  title: string;
  year: number;
  studioName: string;
  producerName: string;
  isWinner: boolean;
};

type StudioProducerAwardMovieCreate = {
  studioToCreate: Omit<Studio, 'movies'>;
  producerToCreate: Omit<Producer, 'movies'>;
  awardToCreate: Omit<Award, 'movies' | 'id'>;
  movieToCreate: MovieCreate;
};

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const records = await this.readCsv();

    const studioProducerAwardMovieToCreate: StudioProducerAwardMovieCreate[] =
      records.map((record) => {
        const movieId = createId();
        return {
          studioToCreate: {
            id: createId(),
            name: record.studioName,
          },
          producerToCreate: {
            id: createId(),
            name: record.producerName,
          },
          awardToCreate: {
            year: record.year,
          },
          movieToCreate: {
            id: movieId,
            title: record.movieTitle,
            year: record.year,
            studioName: record.studioName,
            producerName: record.producerName,
            isWinner: record.isWinner,
          },
        };
      });

    await em.upsertMany(
      Studio,
      [
        ...studioProducerAwardMovieToCreate.map(
          ({ studioToCreate }) => studioToCreate,
        ),
      ],
      {
        onConflictFields: ['name'],
      },
    );

    await em.upsertMany(
      Producer,
      [
        ...studioProducerAwardMovieToCreate.map(
          ({ producerToCreate }) => producerToCreate,
        ),
      ],
      {
        onConflictFields: ['name'],
      },
    );

    await em.upsertMany(
      Award,
      Array.from(
        new Set(
          studioProducerAwardMovieToCreate.map(
            ({ awardToCreate }) => awardToCreate.year,
          ),
        ),
      ).map((year) => ({
        id: createId(),
        year,
      })),
    );

    for (const { movieToCreate } of studioProducerAwardMovieToCreate) {
      await em.create(Movie, {
        id: movieToCreate.id,
        title: movieToCreate.title,
        year: movieToCreate.year,
        studio: await em.findOneOrFail(Studio, {
          name: movieToCreate.studioName,
        }),
        producer: await em.findOneOrFail(Producer, {
          name: movieToCreate.producerName,
        }),
        award:
          movieToCreate.isWinner &&
          (await em.findOneOrFail(Award, {
            year: movieToCreate.year,
          })),
        isWinner: movieToCreate.isWinner,
      });
    }

    await em.flush();
  }

  private readCsv(): Promise<CsvData[]> {
    return new Promise((resolve, reject) => {
      const csvData = [];
      createReadStream(join(process.cwd(), 'src/common/db/seeds/movielist.csv'))
        .pipe(parse({ delimiter: ';', from_line: 2 }))
        .on('data', function (row) {
          const [year, movieTitle, studioName, producerName, winnerString] =
            row;
          csvData.push({
            year: Number(year),
            movieTitle,
            studioName,
            producerName,
            isWinner: winnerString === 'yes',
          });
        })
        .on('end', function () {
          resolve(csvData);
        })
        .on('error', function (error) {
          console.log(error.message);
          reject(error);
        });
    });
  }
}
