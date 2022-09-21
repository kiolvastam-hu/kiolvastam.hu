import { PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";

export default abstract class BaseEntity {
	@PrimaryKey()
	_id!: ObjectId;

	@SerializedPrimaryKey()
	id!: string;

	@Property({lazy:true})
	createdAt = new Date();

	@Property({ onUpdate: () => new Date(), lazy:true}) // ,serializer: e=>new Date(e).toLocaleString()
	updatedAt = new Date();
}