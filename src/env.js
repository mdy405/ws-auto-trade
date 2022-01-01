// read .env file into proces.env
import dotenv from "dotenv";
dotenv.config();

import envalid from "envalid";

const configs = envalid.cleanEnv(process.env, {
  TRADE_USER_POSISTION_ONLY: envalid.bool({ default: true }),
  WS_EMAIL: envalid.str({ default: "" }),
  WS_PASS: envalid.str({ default: "" }),
  USE_GMAIL: envalid.bool({ default: true }),
  GMAIL_ADDRESS: envalid.str({ default: "" }),
  GMAIL_APP_PASSWORD: envalid.str({ default: "" }),
  SERVER_PORT: envalid.port({
    default: 4000,
    desc: "The port to start the server on",
  }),
  DATABASE_URL: envalid.str({
    default:
      "DATABASE_URL=postgres://wsautotrade:wsautotradeP4$$word@127.0.0.1:5432/wsautotrade",
  }),
  DATABASE_URL_SEQUELIZE: envalid.str({
    default:
      "postgres://wsautotrade:wsautotradeP4$$word@127.0.0.1:5432/wsautotrade",
  }),
  ALPHA_ADVANTAGE_API_KEY: envalid.str({
    default: "",
  }),
  ALPHA_ADVANTAGE_API_URL: envalid.str({
    default:
      "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&",
  }),
  CRON_SCHEDULE: envalid.str({
    default: "0 35 9 * * MON-FRI",
  }),
  APP_DATE_FORMAT: envalid.str({
    default: "YYYY-MM-DD",
  }),
});

export default configs;
