import { Entity, ManyToMany, ManyToOne } from "@mikro-orm/core";
import BaseEntity from "./BaseEntity";
import Entry from "./entry";
import User from "./user";

@Entity()
export default class Like extends BaseEntity {
	@ManyToOne(() => User )
	user!: User;

	@ManyToOne(() => Entry)
	entry!: Entry;
}