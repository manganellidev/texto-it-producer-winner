import { Injectable, OnModuleInit } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { DatabaseSeeder } from './db-seeder'; // Make sure to create this seeder class

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    const seeder = this.orm.getSeeder();

    await this.orm.schema.refreshDatabase();
    await seeder.seed(DatabaseSeeder);
  }
}
