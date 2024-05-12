import { Opt, PrimaryKey } from '@mikro-orm/core';
import { createId } from '@paralleldrive/cuid2';

export abstract class BaseEntity {
  @PrimaryKey()
  id: string & Opt = createId();
}
