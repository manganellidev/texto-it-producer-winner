import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { Movie } from '../common/db/entities/movie.entity';

export interface MinMax {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface WinnerProducer {
  min: MinMax[];
  max: MinMax[];
}

export interface YearsByProducer {
  [key: string]: number[];
}

@Injectable()
export class FetchProducerWinner {
  private _minInterval;
  private _maxInterval;
  private _mapMin: MinMax[];
  private _mapMax: MinMax[];

  constructor(
    @InjectRepository(Movie)
    private movieRepository: EntityRepository<Movie>,
  ) {
    this._minInterval = 1;
    this._maxInterval = 1;
    this._mapMin = [];
    this._mapMax = [];
  }

  get mapMax() {
    return this._mapMax;
  }

  get mapMin() {
    return this._mapMin;
  }

  async execute(): Promise<WinnerProducer> {
    this.reset();

    const winnerMovies = await this.movieRepository.findAll({
      where: { isWinner: true },
      populate: ['producer'],
    });

    const yearsByProducer =
      this.mapMovieYearsByProducersWithMoreThanOne(winnerMovies);

    for (const [producer, years] of Object.entries(yearsByProducer)) {
      const sortedYears = years.sort((a, b) => a - b);

      this.mapMaxProducers(producer, sortedYears);
      this.mapMinProducers(producer, sortedYears);
    }

    return {
      min: this._mapMin,
      max: this._mapMax,
    };
  }

  mapMovieYearsByProducersWithMoreThanOne(
    winnerMovies: Movie[],
  ): YearsByProducer {
    const yearsByProducer = winnerMovies.reduce(
      (acc: YearsByProducer, curr: Movie) => {
        if (!acc[curr.producer.name]) {
          acc[curr.producer.name] = [];
        }
        acc[curr.producer.name].push(curr.year);
        return acc;
      },
      {},
    );

    const yearsByProducerWithMoreThanOne: YearsByProducer = {};
    for (const producer of Object.keys(yearsByProducer)) {
      if (yearsByProducer[producer].length > 1) {
        yearsByProducerWithMoreThanOne[producer] = yearsByProducer[producer];
      }
    }

    return yearsByProducerWithMoreThanOne;
  }

  mapMinProducers(producerName: string, sortedYears: number[]): void {
    for (const [idx, currYear] of sortedYears.entries()) {
      if (idx === 0) continue;

      const previousYear = sortedYears[idx - 1];
      const diffMinYear = currYear - previousYear;

      if (!this._mapMin.length) {
        this._minInterval = diffMinYear;
        this._mapMin = [
          this.mapToMinMax(
            producerName,
            this._minInterval,
            previousYear,
            currYear,
          ),
        ];
      } else if (diffMinYear < this._minInterval) {
        this._minInterval = diffMinYear;
        this._mapMin = [
          this.mapToMinMax(
            producerName,
            this._minInterval,
            previousYear,
            currYear,
          ),
        ];
      } else if (diffMinYear === this._minInterval) {
        this._mapMin.push(
          this.mapToMinMax(
            producerName,
            this._minInterval,
            previousYear,
            currYear,
          ),
        );
      }
    }
  }

  mapMaxProducers(producerName: string, sortedYears: number[]): void {
    const firstYear = sortedYears[0];
    const lastYear = sortedYears[sortedYears.length - 1];
    const diffMaxYear = lastYear - firstYear;

    if (diffMaxYear > this._maxInterval) {
      this._maxInterval = diffMaxYear;
      this._mapMax = [
        this.mapToMinMax(producerName, this._maxInterval, firstYear, lastYear),
      ];
    } else if (diffMaxYear === this._maxInterval) {
      this._mapMax.push(
        this.mapToMinMax(producerName, this._maxInterval, firstYear, lastYear),
      );
    }
  }

  private mapToMinMax(
    producerName: string,
    interval: number,
    previousWin: number,
    followingWin: number,
  ): MinMax {
    return {
      producer: producerName,
      interval,
      previousWin,
      followingWin,
    };
  }

  reset() {
    this._minInterval = 1;
    this._maxInterval = 1;
    this._mapMin = [];
    this._mapMax = [];
  }
}
