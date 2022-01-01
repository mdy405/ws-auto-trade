import fs from "fs";
import Sequelize from "sequelize";
import env from "../env.js";
import path from "path";
import request from "request";
const Op = Sequelize.Op;
import { stockHistory } from "../db/models/stockHistory.js";
import moment from "moment";

const sequelize = new Sequelize(env.DATABASE_URL_SEQUELIZE, {
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

let db = {};

export const initDB = () => {
  db.StockHistory = stockHistory(sequelize);
  db.StockHistory.sync();

  console.log(JSON.stringify(db));
  return db;
};

/* ========================== STOCK SECTION =========================== */

export const findAllForRange = (stocks, start, end, cb) => {
  /* let startDate =  moment(start, "YYYY-MM-DD");
  let endDate =  moment(end, "YYYY-MM-DD");*/
  db.StockHistory.findAll({
    where: {
      symbol: { [Op.in]: stocks },
      timestamp: {
        [Op.lt]: moment(end, "YYYY-MM-DD").unix(),
        [Op.gt]: moment(start, "YYYY-MM-DD").unix(),
      },
    },
    order: [["timestamp", "ASC"]],
  }).then((results) => {
    let grouped = {};
    results.forEach(function (row) {
      if (!grouped[row.symbol]) {
        grouped[row.symbol] = [];
      }
      grouped[row.symbol].push(row);
    });
    cb(grouped);
  });
};

export const updateStock = (stockCode, appdb) => {
  let path =
    env.ALPHA_ADVANTAGE_API_URL +
    "symbol=" +
    stockCode +
    "&apikey=" +
    env.ALPHA_ADVANTAGE_API_KEY;
  console.log("Calling: " + path);
  request.get(path, function (err, res) {
    try {
      res.body = JSON.parse(res.body);
    } catch (e) {
      console.log(
        "\n\n\n\nERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n Failed to update stocks\n\n\n\n\n\n"
      );
      return;
    }

    if (!res.body["Meta Data"]) {
      console.log("Failed to find " + stockCode);
      return;
    }
    console.log(res.body["Meta Data"]);
    let allInserts = [];
    db.StockHistory.findAll({
      where: { symbol: stockCode },
      raw: true,
    }).then((stockHistory) => {
      let existingTimestamps = [];
      stockHistory.forEach((stockHistory) => {
        existingTimestamps.push(stockHistory.timestamp);
      });
      Object.keys(res.body["Time Series (Daily)"]).forEach(function (key) {
        let timestampUnix = moment(key, "YYYY-MM-DD").unix();
        if (existingTimestamps.indexOf(timestampUnix) === -1) {
          let stockDate = res.body["Time Series (Daily)"][key];
          db.StockHistory.create({
            symbol: stockCode,
            timestamp: timestampUnix,
            open: stockDate["1. open"],
            close: stockDate["4. close"],
            volume: stockDate["5. volume"],
          });
        }
      });
    });
  });
};
/* ========================== End STOCK SECTION =========================== */
