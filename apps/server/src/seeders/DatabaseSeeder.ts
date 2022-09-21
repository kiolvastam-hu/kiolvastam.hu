import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import {TestSeeder} from './TestSeeder';

// eslint-disable-next-line import/prefer-default-export
export class DatabaseSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    return this.call(em,[TestSeeder])
  }

}
