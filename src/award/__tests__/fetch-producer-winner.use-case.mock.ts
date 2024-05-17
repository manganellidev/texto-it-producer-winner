import { Movie } from 'src/common/db/entities/movie.entity';

export const moviesMoreThanOneMock = [
  {
    year: 1980,
    producer: {
      name: 'Severus Snape',
    },
  },
  {
    year: 1990,
    producer: {
      name: 'Severus Snape',
    },
  },
  {
    year: 1982,
    producer: {
      name: 'Nicolas Flamel',
    },
  },
] as Movie[];

export const winnerMoviesMock = [
  {
    year: 1980,
    producer: {
      name: 'Severus Snape',
    },
  },
  {
    year: 1990,
    producer: {
      name: 'Severus Snape',
    },
  },
  {
    year: 1982,
    producer: {
      name: 'Nicolas Flamel',
    },
  },
  {
    year: 1981,
    producer: {
      name: 'Nicolas Flamel',
    },
  },
  {
    year: 2000,
    producer: {
      name: 'Ron Weasley',
    },
  },
  {
    year: 2001,
    producer: {
      name: 'Ron Weasley',
    },
  },
  {
    year: 2002,
    producer: {
      name: 'Dobby',
    },
  },
  {
    year: 1999,
    producer: {
      name: 'Rubeus Hagrid',
    },
  },
  {
    year: 2003,
    producer: {
      name: 'Rubeus Hagrid',
    },
  },
  {
    year: 2013,
    producer: {
      name: 'Rubeus Hagrid',
    },
  },
  {
    year: 2020,
    producer: {
      name: 'Rubeus Hagrid',
    },
  },
  {
    year: 2030,
    producer: {
      name: 'Rubeus Hagrid',
    },
  },
] as Movie[];
