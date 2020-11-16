"use strict";

const jsonStore = require("./json-store");

const allStocks = {
  store: new jsonStore("./models/allStocks.json", { allStocksCollection: [] }),
  collection: "allStocksCollection",

  getAllStocks() {
    return this.store.findAll(this.collection);
  },

};

module.exports = allStocks;