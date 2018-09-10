import { Response } from 'express';

import { Route } from '../models/route';
import { SlackRequest } from '../models/slack-request';

const RootRoute: Route = {
  path: '/',
  verb: 'post',
  handler: (req: SlackRequest, res: Response) => {
    res.send('You made it!');
  }
};

export default RootRoute;
