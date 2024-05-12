import { Controller, Get } from '@nestjs/common';
import {
  FetchProducerWinner,
  WinnerProducer,
} from './fetch-producer-winner.use-case';

@Controller('awards')
export class AwardController {
  constructor(private fetchProducerWinner: FetchProducerWinner) {}

  @Get('/min-max-winner-producers')
  find(): Promise<WinnerProducer> {
    return this.fetchProducerWinner.execute();
  }
}
