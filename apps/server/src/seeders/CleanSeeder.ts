/* eslint-disable class-methods-use-this */
/**
 * This seed file removes all entries from the database.
 */

import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import Entry from "../entities/entry";
import Like from "../entities/like";
import Comment from "../entities/Comment";
import User from "../entities/user";

// eslint-disable-next-line import/prefer-default-export
export class CleanSeeder extends Seeder {

	async run(em: EntityManager): Promise<void> {
		await em.nativeDelete(User, {});
		await em.nativeDelete(Entry, {});
		await em.nativeDelete(Like, {});
		await em.nativeDelete(Comment, {});
	}


}