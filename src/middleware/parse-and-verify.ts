import { Request, NextFunction, Response } from 'express';
import bodyParser from 'body-parser';
import { createHmac } from 'crypto';

import { unix } from '../helpers/time';
import config from '../config';

const SLACK_TIMESTAMP = 'X-Slack-Request-Timestamp';
const SLACK_SIGNATURE = 'X-Slack-Signature';
const SLACK_VERSION = 'v0';

/**
 * Reject replay attacks, parse the body and then verify the signature.
 * @param req
 * @param res
 * @param next
 */
export default function parseAndVerify(req: Request, res: Response, next: NextFunction) {
  bodyParser.urlencoded({
    extended: true,
    verify: verifySignature
  })(req, res, next);
}

/**
 * Determine if the signature sent matches the needed Slack signature.
 * @param req
 * @param res
 * @param buf
 */
export function verifySignature(req: Request, res: Response, buf: Buffer) {
  const timestamp = parseInt(req.get(SLACK_TIMESTAMP), 10);
  const signature = `v0=${buildSignature(config.SLACK_SIGNING_SECRET, `${SLACK_VERSION}:${timestamp}:${buf.toString()}`)}`;
  let error: Error;

  // Reject potential replay attacks
  if (timestamp + config.REPLAY_ATTACK_TIME <= unix()) {
    error = new Error('Invalid timestamp.');
  }

  // Reject invalid slack signatures
  if (!error && config.PRODUCTION && signature !== req.get(SLACK_SIGNATURE)) {
    error = new Error('Invalid signature.');
  }

  // If there is an error, set the response and throw it to stop the request.
  if (error) {
    res.status(403).send(error.message);
    throw error;
  }
}

/**
 * Build a signature HMAC.
 * @param secret
 * @param signatureBase
 * @return string
 */
export function buildSignature(secret: string, base: string): string {
  const hash = createHmac('sha256', secret);
  hash.update(base);
  return hash.digest('hex');
}
