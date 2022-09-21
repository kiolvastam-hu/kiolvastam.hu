import { Configuration, IDatabaseDriver, Options, Utils } from "@mikro-orm/core";
import { MONGO_URI } from "./constants";
import Comment from "./entities/Comment";
import Entry from "./entities/entry";
import Like from "./entities/like";
import User from "./entities/user";

const {
    NODE_ENV,
} = process.env;
export default {
    type: "mongo",
    dbName: NODE_ENV === 'test' ? 'test' : /* istanbul ignore next: production db */ 'prod',
    clientUrl: MONGO_URI,
    entities: [User,Entry,Comment,Like],
    seeder: {
        path: Utils.detectTsNode()? './src/seeders':'./dist/seeders',
        defaultSeeder: 'TestSeeder'
        
    },
    forceUtcTimezone:true
} as Options<IDatabaseDriver> | Configuration<IDatabaseDriver>;