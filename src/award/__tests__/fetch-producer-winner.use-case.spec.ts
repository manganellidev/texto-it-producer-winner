import {
  FetchProducerWinner,
  WinnerProducer,
} from '../fetch-producer-winner.use-case';

import {
  moviesMoreThanOneMock,
  winnerMoviesMock,
} from './fetch-producer-winner.use-case.mock';

describe('Fetch Producer Winner Use Case', () => {
  let fetchProducerWinner: FetchProducerWinner;
  const movieRepositoryMock = {
    findAll: jest.fn().mockResolvedValue(winnerMoviesMock),
  };
  beforeAll(() => {
    fetchProducerWinner = new FetchProducerWinner(movieRepositoryMock as any);
  });

  it('should return min max producer winners', async () => {
    const expectedResult: WinnerProducer = {
      min: [
        {
          producer: 'Nicolas Flamel',
          interval: 1,
          previousWin: 1981,
          followingWin: 1982,
        },
        {
          producer: 'Ron Weasley',
          interval: 1,
          previousWin: 2000,
          followingWin: 2001,
        },
      ],
      max: [
        {
          producer: 'Severus Snape',
          interval: 10,
          previousWin: 1980,
          followingWin: 1990,
        },
        {
          producer: 'Rubeus Hagrid',
          interval: 10,
          previousWin: 2003,
          followingWin: 2013,
        },
        {
          producer: 'Rubeus Hagrid',
          interval: 10,
          previousWin: 2020,
          followingWin: 2030,
        },
      ],
    };

    const result = await fetchProducerWinner.execute();

    expect(result).toStrictEqual(expectedResult);
  });

  it('should return movie years aggregated by producer name when producer has more than one', () => {
    const expectedResult = { 'Severus Snape': [1980, 1990] };

    const actualResult =
      fetchProducerWinner.mapMovieYearsByProducersWithMoreThanOne(
        moviesMoreThanOneMock,
      );

    expect(actualResult).toStrictEqual(expectedResult);
  });
});
