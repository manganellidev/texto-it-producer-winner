import { Test, TestingModule } from '@nestjs/testing';
import { AwardController } from '../producer-award.controller';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { FetchProducerWinner } from '../fetch-producer-winner.use-case';
import { Movie } from '../../common/db/entities/movie.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from '../../mikro-orm.config';
import { SeederService } from '../../common/db/seeds/seeder.service';

describe('AwardController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AwardController],
      providers: [FetchProducerWinner, SeederService],
      imports: [
        MikroOrmModule.forRoot(mikroOrmConfig),
        MikroOrmModule.forFeature([Movie]),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => await app.close());

  it('(GET) /awards/min-max-winner-producers', async () => {
    const expectedResponseBody = {
      min: [
        {
          producer: 'Joel Silver',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
      max: [
        {
          producer: 'Matthew Vaughn',
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    };

    const actualResponse = await request(app.getHttpServer()).get(
      '/awards/min-max-winner-producers',
    );

    expect(actualResponse.statusCode).toStrictEqual(200);
    expect(actualResponse.body).toStrictEqual(expectedResponseBody);
  });
});
