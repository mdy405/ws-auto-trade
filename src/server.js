import moment from "moment";
import express from "express";
import { Server } from "socket.io";
import http from "http";
/////////////////////////////////////////////////////////////////

//custom import
import env from "./env.js";
import { loginToWs, getData, getQuote } from "./wshelper/index.js";
/////////////////////////////////////////////////////////////////

//set config properties
const PORT = env.SERVER_PORT;
const ws_email = env.WS_EMAIL;
const ws_password = env.WS_PASS;
const use_user_positions = env.TRADE_USER_POSISTION_ONLY;
/////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
const exchanges = [
  "NASDAQ",
  "NYSE",
  "TSX",
  "TSX-V",
  "AEQUITAS NEO EXCHANGE",
  "CC",
];
/////////////////////////////////////////////////////////////////

//server setup
const app = express();
const server = http.createServer(app);
const io = new Server(server);
let wsAuth;
/////////////////////////////////////////////////////////////////
let stocks = [];
const initStockData = async (data) => {
  let securityGroups = await data.securityGroups();

  for (var key of Object.keys(securityGroups)) {
    let secGroupDetailsWitExchange = [];
    let secGroupDetails = await data.getSecurityGroup(key);

    secGroupDetails = secGroupDetails.filter(
      (item) =>
        item.stock.primary_exchange !== null &&
        item.stock.primary_exchange !== undefined &&
        exchanges.includes(item.stock.primary_exchange)
    );

    secGroupDetailsWitExchange = secGroupDetails.map((security) => {
      if (security.stock.primary_exchange)
        return security.stock.symbol + ":" + security.stock.primary_exchange;
    });
    if (secGroupDetailsWitExchange && secGroupDetailsWitExchange.length > 0)
      stocks = [...stocks, ...secGroupDetailsWitExchange];
  }
};

//App Entry Point
async function run() {
  console.log(" ");
  wsAuth = await loginToWs(ws_email, ws_password);

  let data = getData();
  let quotes = getQuote();

  initStockData(data);

  if (wsAuth == null || wsAuth == undefined) {
    console.log("login to whealthSimple failed.");
    process.exit(1);
  }

  setInterval(async () => {
    for (let stock of stocks) {
      console.log("==========>getting quotes for:", stock);
      let currentStockValue = await quotes.get(stock);
      console.log("==========>Current stock value :", currentStockValue);
    }
  }, 900000);
}

//////////////////////start server///////////////////////////////
io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);

  run();
});
/////////////////////////////////////////////////////////////////
