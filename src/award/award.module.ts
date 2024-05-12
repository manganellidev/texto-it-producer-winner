import { Module } from '@nestjs/common';
import { AwardController } from './producer-award.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Movie } from 'src/common/db/entities/movie.entity';
import { FetchProducerWinner } from './fetch-producer-winner.use-case';

@Module({
  imports: [MikroOrmModule.forFeature([Movie])],
  providers: [FetchProducerWinner],
  controllers: [AwardController],
})
export class AwardModule {}
