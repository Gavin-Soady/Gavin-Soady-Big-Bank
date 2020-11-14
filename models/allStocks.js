"use strict";

const _ = require("lodash");
const jsonStore = require("./json-store");
const https = require('https');
const logger = require("../utils/logger");
const fetch = require('node-fetch');

const allStocks = {
  store: new jsonStore("./models/allStocks.json", { allStocksCollection: [] }),
  collection: "allStocksCollection",

  getAllStockss() {
    return this.store.findAll(this.collection);
  },
  getAllStocks() {

      return fetch('https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=SA&apikey=C34LLCPBG7XECGUG')
        .then(res => res.json())
        .then(json => {
         // console.log("BestMatches:");
          //console.log(json["bestMatches"]);
          //search=json.bestMatches;
        })
  }

};

module.exports = allStocks;