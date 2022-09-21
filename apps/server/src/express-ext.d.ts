import { EntityRepository, MikroORM, IDatabaseDriver } from "@mikro-orm/core";
import Entry from "./entities/entry";
import Comment from "./entities/Comment";
import ApplicationUser from "./entities/user";
import Like from './entities/like';

declare global {
  namespace Express {

    interface User {
      id: number;
    }

    interface Request {
      orm: MikroORM<IDatabaseDriver>;
      userRepository?: EntityRepository<ApplicationUser>;
      entryRepository?: EntityRepository<Entry>;
      commentRepository?: EntityRepository<Comment>;
      likeRepository?: EntityRepository<Like>;
      user?: ApplicationUser;
      entry?: Entry;
    }
    
  }
}
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}