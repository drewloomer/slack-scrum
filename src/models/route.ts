import { RequestHandlerParams } from 'express-serve-static-core';

type Verb = 'get' | 'post';

export interface Route {
  path: string;
  verb: Verb;
  handler: RequestHandlerParams;
}
