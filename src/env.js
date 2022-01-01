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
});

export default configs;
