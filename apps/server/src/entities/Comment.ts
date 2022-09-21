import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import BaseEntity from "./BaseEntity";
import Entry from "./entry";
import User from "./user";

@Entity()
export default class Comment extends BaseEntity {

	@ManyToOne(() => User)
	user!: User;

	@ManyToOne(() => Entry,{hidden:true})
	entry!: Entry;
	
	@Property()
	text!: string;

}