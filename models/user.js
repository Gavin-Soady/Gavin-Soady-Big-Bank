"use strict";

const _ = require("lodash");
const jsonStore = require("./json-store");

const user = {
  store: new jsonStore("./models/user-store.json", { users: [] }),
  collection: "users",

  getAllUsers() {
    return this.store.findAll(this.collection);
  },
  setUserStocksNumber(userID, stocksNum){
    let user = this.store.findOneBy(this.collection, { id: userID });
    user.numOfStocks = stocksNum;
  },
  addUser(user) {
    this.store.add(this.collection, user);
    this.store.save();
  },
  removeUser(id) {
    const user = this.getUserById(id);
    this.store.remove(this.collection, user);
    this.store.save();
  },
  getUserById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },
  getUserByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

};

module.exports = user;
