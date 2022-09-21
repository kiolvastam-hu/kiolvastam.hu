import { Cascade, Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { v4 } from 'uuid';
import BaseEntity from "./BaseEntity";
import Entry from "./entry";
import Comment from "./Comment";
import Like from "./like";

@Entity()
export default class User extends BaseEntity {


  @Property()
  username!: string;

  @Property()
  role!: 'user' | 'moderator' | 'admin';

  @Property({ lazy: true })
  email!: string;

  @Property({ default: false })
  emailPrivate!: boolean;

  @Property({ hidden: true })
  password!: string;

  @Property({ hidden: true })
  unique_code = v4();

  @Property({ nullable: true })
  birthday!: Date;

  @Property({ default: false })
  birthdayPrivate!: boolean;

  @Property({ name: 'age' })
  getAge() {
    return this.birthday ? Math.floor((Date.now() - this.birthday.getTime()) / (1000 * 60 * 60 * 24 * 365)) : 0;
  }

  @Property()
  following!: string[];

  @OneToMany('Entry', 'user', { lazy: true, cascade: [Cascade.REMOVE] })
  entries = new Collection<Entry>(this);

  @OneToMany('Comment', 'user', { lazy: true, cascade: [Cascade.REMOVE] })
  comments = new Collection<Comment>(this);

  @OneToMany('Like', 'user', { lazy: true, cascade: [Cascade.REMOVE] })
  likes = new Collection<Like>(this);
}