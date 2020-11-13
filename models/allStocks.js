"use strict";

const _ = require("lodash");
const jsonStore = require("./json-store");


const allStocks = {
  store: new jsonStore("./models/allStocks.json", { allStocksCollection: [] }),
  collection: "allStocksCollection",

  getAllStocks() {
    return this.store.findAll(this.collection);
  },

  getStock(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getUserStocks(userId) {
    return this.store.findBy(this.collection, { userId: userId });
  },
  addStock(stock) {
    this.store.add(this.collection, stock);
    this.store.save();
  },
  removeStock(id) {
    const stock = this.getStock(id);
    this.store.remove(this.collection, stock);
    this.store.save();
  }
};

module.exports = allStocks;