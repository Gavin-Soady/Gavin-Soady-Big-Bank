"use strict";

const _ = require("lodash");
const jsonStore = require("./json-store");
const userStore = require("./user-store.json");

const stocksStore = {
  store: new jsonStore("./models/stocks-store.json", { stocksCollection: [] }),
  collection: "stocksCollection",

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

module.exports = stocksStore;