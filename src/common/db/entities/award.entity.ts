import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Movie } from './movie.entity';

@Entity()
export class Award extends BaseEntity {
  @Property()
  year: number;

  @OneToMany(() => Movie, (movie) => movie.award)
  movies = new Collection<Movie>(this);
}
