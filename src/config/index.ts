import env from 'dotenv';

class Config {
  PORT = 3000;
  REPLAY_ATTACK_TIME = 300;
  PRODUCTION = false;
  SLACK_APP_ID: string;
  SLACK_CLIENT_ID: string;
  SLACK_CLIENT_SECRET: string;
  SLACK_SIGNING_SECRET: string;

  constructor(env: object) {
    Object.assign(this, env);
  }
}

export default new Config(env.config().parsed);
