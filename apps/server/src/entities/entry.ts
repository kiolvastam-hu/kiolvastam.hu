import { Cascade, Collection, Entity, ManyToOne, OneToMany, Property, wrap } from "@mikro-orm/core";
import BaseEntity from "./BaseEntity";
import Book from "./Book";
import Comment from "./Comment";
import Like from "./like";
import User from "./user";

@Entity()
export default class Entry extends BaseEntity {

	@ManyToOne(() => User)
	user!: User;

	@Property()
	private = false;
	
	@Property()
	showComments = true;

	@Property()
	opinion?: string;

	@Property()
	summary?: string;
	
	@Property()
	book!: Book;

	@Property()
	tags!: string[];

	@Property({ name: 'likeCount'})
	getLikeCount() {
		return this.likes.length;
	}

	@OneToMany('Comment', 'entry', {cascade: [Cascade.REMOVE]})
	comments = new Collection<Comment>(this);

	@OneToMany('Like', 'entry', { hidden: true, cascade: [Cascade.REMOVE] })
	likes = new Collection<Like>(this);

}