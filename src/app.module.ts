import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AwardModule } from './award/award.module';
import mikroOrmConfig from './mikro-orm.config';
import { SeederService } from './common/db/seeds/seeder.service';

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmConfig), AwardModule],
  providers: [SeederService],
})
export class AppModule {}
