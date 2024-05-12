import { SqliteDriver } from '@mikro-orm/sqlite';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SeedManager } from '@mikro-orm/seeder';

export default {
  driver: SqliteDriver,
  dbName: 'text-it-assessment-db',
  entities: ['src/**/*.entity.js'],
  metadataProvider: TsMorphMetadataProvider,
  autoLoadEntities: true,
  extensions: [SeedManager],
};
