import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Award } from './award.entity';
import { Studio } from './studio.entity';
import { Producer } from './producer.entity';

@Entity()
export class Movie extends BaseEntity {
  @Property()
  title: string;

  @Property()
  year: number;

  @ManyToOne(() => Studio)
  studio: Studio;

  @ManyToOne(() => Producer)
  producer: Producer;

  @ManyToOne(() => Award, { nullable: true })
  award: Award;

  @Property({ nullable: true })
  isWinner: boolean = false;
}
