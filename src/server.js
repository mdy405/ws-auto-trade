import moment from "moment";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import morgan from "morgan";
import nodeCron from "node-cron";
/////////////////////////////////////////////////////////////////

//custom import
import { initDB, updateStock, findAllForRange } from "./utils/stockService.js";
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

const toWatch = ["TSLA:NASDAQ"];

/////////////////////////////////////////////////////////////////
////////////////////////db///////////////////////////////////////
/////////////////////////////////////////////////////////////////

const db = initDB();
/////////////////////DB end /////////////////////////////////////

//server setup
const app = express();
// Log requests to the console.
app.use(morgan("dev"));
const server = http.createServer(app);
const io = new Server(server);
let wsAuth;
/////////////////////////////////////////////////////////////////
let stocks = [];
let dbUpdated = false;

nodeCron.schedule(env.CRON_SCHEDULE, () => {
  if (stocks && stocks.length > 0) {
    let counter = 0;
    const WAIT_BETWEEN_CALLS = 1000; // 1 second
    stocks.forEach(function (stock, index) {
      // This part may get too intensive if tracking lots of stocks.
      // Please be respectful of Alphavantage's suggestion of max requests per minute
      if (index <= 3) {
        setTimeout(function () {
          console.log("Updating " + stock.split(":")[0]);
          updateStock(stock.split(":")[0]);
        }, counter * WAIT_BETWEEN_CALLS);
        counter++;
        dbUpdated = true;
      } else {
        return;
      }
    });
  } else {
    console.log("No stocks to update");
  }
});

/////////////////////////////////////////////////////////////////
////////////////get all ticket available on ws///////////////////
/////////////////////////////////////////////////////////////////
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

  //initStockData(data);

  stocks = ["TSLA:NASDAQ"];

  if (wsAuth == null || wsAuth == undefined) {
    console.log("login to whealthSimple failed.");
    process.exit(1);
  }

  const dataFrom = moment().subtract(3, "M").format(env.APP_DATE_FORMAT);
  const dataTo = moment().format(env.APP_DATE_FORMAT);

  setInterval(async () => {
    findAllForRange([stocks[0].split(":")[0]], dataFrom, dataTo, (data) => {
      if (data && data.length > 0) {
        console.log(data);
      }
    });
    for (let stock of toWatch) {
      console.log("==========>getting quotes for:", stock);
      let currentStockValue = await quotes.get(stock);
      console.log("==========>Current stock value :", currentStockValue);
    }

    /*let stockToWatch = stocks[0];
    if (stockToWatch) {
      updateStock(stockToWatch.split(":")[0], db);
    }*/
  }, 30000);
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
