import { Entity, Property } from "@mikro-orm/core";

@Entity()
export default class Book {

	@Property()
	title!: string;

	@Property()
	author!: string;

	@Property()
	pub_year!: number

	@Property()
	cover_url!: string;
	
	@Property()
	moly_id!: number;
	
	@Property()
	moly_url!: string;

	constructor (properties:{
		title:string,author:string,pub_year:number,cover_url:string,moly_id:number,moly_url:string
	}) {
		this.title = properties.title;
		this.author= properties.author;
		this.pub_year = properties.pub_year;
		this.cover_url = properties.cover_url;
		this.moly_id = properties.moly_id;
		this.moly_url = properties.moly_url;
	}
}