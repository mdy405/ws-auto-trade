import WS from "wstrade-api";
import path from "path";
import Promisify from "util";
import fs from "fs";

const __dirname = path.resolve() + "/src/wshelper";
const { auth, quotes, data, accounts } = WS;

// Promisify with promise
const { promisify } = Promisify;
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

//storeToken and refreshToken
const WS_TOKEN = __dirname + "/ws.json";

//TODO: read code from Gmail
auth.on("otp", "045716");

export const loginToWs = async (email, password) => {
  try {
    if (fs.existsSync(WS_TOKEN)) {
      const content = await readFileAsync(WS_TOKEN);
      const credentials = JSON.parse(content); //credential
      auth.use(credentials);
      return auth;
    } else {
      await auth.login(email, password);

      await writeFileAsync(WS_TOKEN, JSON.stringify(auth.tokens()));

      return auth;
    }
  } catch (err) {
    //if (fs.existsSync) fs.unlinkSync(WS_TOKEN);
    console.log(err);
  }
};

export const getQuote = () => {
  return quotes;
};

export const getData = () => {
  return data;
};

export const getAccount = () => {
  return accounts;
};
