import {
  FetchProducerWinner,
  YearsByProducer,
  MinMax,
  WinnerProducer,
} from '../fetch-producer-winner.use-case';

import {
  moviesMoreThanOneMock,
  winnerMoviesMock,
} from './fetch-producer-winner.use-case.mock';

// jest.mock('../../common/db/entities/movie.entity.ts');

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

  it('should return max producers', () => {
    const yearsByProducerMock: YearsByProducer = {
      'Severus Snape': [1980, 1983, 1990],
      'Nicolas Flamel': [1810, 1813],
      'Rubeus Hagrid': [2000, 2010],
      'Albus Dumbledore': [1950, 1953],
    };
    const expectedResult: MinMax[] = [
      {
        producer: 'Severus Snape',
        interval: 10,
        previousWin: 1980,
        followingWin: 1990,
      },
      {
        producer: 'Rubeus Hagrid',
        interval: 10,
        previousWin: 2000,
        followingWin: 2010,
      },
    ];

    fetchProducerWinner.reset();
    Object.entries(yearsByProducerMock).forEach(
      ([producerName, sortedYears]) => {
        fetchProducerWinner.mapMaxProducers(producerName, sortedYears);
      },
    );

    expect(fetchProducerWinner.mapMax).toStrictEqual(expectedResult);
  });

  it('should return min producers', () => {
    const yearsByProducerMock: YearsByProducer = {
      'Severus Snape': [1980, 1983, 1990],
      'Nicolas Flamel': [1810, 1813],
      'Rubeus Hagrid': [2000, 2010],
      'Albus Dumbledore': [1950, 1953],
    };
    const expectedResult: MinMax[] = [
      {
        producer: 'Severus Snape',
        interval: 3,
        previousWin: 1980,
        followingWin: 1983,
      },
      {
        producer: 'Nicolas Flamel',
        interval: 3,
        previousWin: 1810,
        followingWin: 1813,
      },
      {
        producer: 'Albus Dumbledore',
        interval: 3,
        previousWin: 1950,
        followingWin: 1953,
      },
    ];

    fetchProducerWinner.reset();
    Object.entries(yearsByProducerMock).forEach(
      ([producerName, sortedYears]) => {
        fetchProducerWinner.mapMinProducers(producerName, sortedYears);
      },
    );

    expect(fetchProducerWinner.mapMin).toStrictEqual(expectedResult);
  });
});
