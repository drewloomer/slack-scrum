import errorHandler from 'errorhandler';
import express, { Express } from 'express';

import config from './config';
import routes from './routes';
import parseAndVerify from './middleware/parse-and-verify';

export class App {
  private app: Express;

  constructor() {
    this.initApp();
    this.initRoutes();
    this.startApp();
  }

  private initApp() {
    this.app = express();
    this.app.use(errorHandler());
    this.app.use(parseAndVerify);
  }

  private initRoutes() {
    routes.forEach(route => {
      console.log(`Adding route: ${route.verb.toUpperCase()} ${route.path}`);
      this.app[route.verb](route.path, route.handler);
    });
  }

  private startApp() {
    this.app.listen(config.PORT, () => {
      console.log(`App is running at http://localhost:${config.PORT}\n`);
      console.log('Press CTRL-C to stop\n');
    });
  }
}
