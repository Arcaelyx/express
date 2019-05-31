import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import csrf from 'csurf';
import logger from './util/logger';
import errorHandler from './util/errorHandler';

const makeRouter = (behaviors, asyncManager) => {
  const router = Router();
  behaviors.forEach(({endpoint, method, behavior}) => {
    router[method](endpoint, ...behavior.map(b => asyncManager(b)));
  });
  return router;
}

const makeApp = config => {
  const app = express();

  app.use(helmet());
  app.use(morgan('combined', { stream: logger.stream }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(csrf({cookie: true}));



  app.use((req, res, next) => next({status: 404}))
  app.use(errorHandler(logger));

  return app;
};

module.exports = makeApp;
