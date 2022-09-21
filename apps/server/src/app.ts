import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan"
import { MONGO_URI } from "./constants";
import router from "./controllers";
import mikroorm from "./mikroorm";
import ormConfig from './mikro-orm.config'
import { version } from '../package.json'
import { notFoundMiddleware, errorMiddleware } from "./middlewares";

const app = express();
const { NODE_ENV } = process.env;
const inCodespace = process.env.CODESPACES === "true";
const inProduction = NODE_ENV === "production";
const inLocalhost = !inCodespace && !inProduction;
console.log({ MONGO_URI });

// Middlewares

// Morgan - Logger
app.use(morgan('tiny'))

// Helmet - Security
app.use(helmet())

// CORS - Cross-Origin Resource Sharing
app.use(
  cors({
    origin: NODE_ENV === "production" ? "https://www.kiolvastam.hu" : "http://localhost:3000",
    credentials: true
  })
)

// BodyParser - Parse request body
app.use(
  bodyParser.json({
    limit: "50mb",
    // verify(req, res, buf) {
    //   req.rawBody = buf;
    // },
  })
);

// CookieParser - Parse cookies
app.use(cookieParser())

// Session - Store session data
app.set('trust proxy', 1)
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  name: 'qid',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
    sameSite: !inLocalhost ? "none" : "lax",
    secure: !inLocalhost,
    domain: !inLocalhost ? undefined : "localhost" 
  },
  store: MongoStore.create({ mongoUrl: MONGO_URI })
}))

// MikroORM - ORM
app.use(mikroorm(ormConfig))

// Router - Custom Routes defined in controllers/index.ts
app.use(router);

// HelloWorld - Custom Route
app.get("/", (req, res) => {
  req.body = {
    "msg": "Hello world",
    version
  };
  res.send(req.body);
});

// 404 - Not Found
app.use(notFoundMiddleware);

// Error - Error Handler
app.use(errorMiddleware);

export default app