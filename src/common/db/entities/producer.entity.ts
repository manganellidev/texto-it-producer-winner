import {
  Collection,
  Entity,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Movie } from './movie.entity';

@Entity()
export class Producer extends BaseEntity {
  @Property()
  @Unique()
  name: string;

  @OneToMany(() => Movie, (movie) => movie.producer)
  movies = new Collection<Movie>(this);
}
