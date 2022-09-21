import {
  Configuration,
  IDatabaseDriver,
  MikroORM,
  Options,
  RequestContext,
} from "@mikro-orm/core";
import { RequestHandler } from "express";

let orm: MikroORM<IDatabaseDriver>;

export default function mikroorm(
  config: Options<IDatabaseDriver> | Configuration<IDatabaseDriver>
): RequestHandler {
  return async (req, res, next) => {
    if (!orm) {
      orm = await MikroORM.init(config);
    }
    req.orm = orm;
    RequestContext.create(orm.em, next);
  };
}
