"use strict";

const accounts = require("./accounts.js");
const _ = require("lodash");
const logger = require("../utils/logger");
const stocksStore = require("../models/stocks-store.js");
const allStocks = require("../models/allStocks.js");
const user = require("../models/user.js");
const uuid = require("uuid");
const fetch = require('node-fetch');


const dashboard = {
  index(request, response) {
    //logger.info("dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: "Stocks List",
      user: loggedInUser,
      stocks: stocksStore.getUserStocks(loggedInUser.id)
    };
    //logger.info(viewData.stocks);
    response.render("stocksList", viewData);
  },
  showUser(request, response){
    const viewData = {
      title: "Dashboard",
      user: user.getUserById(request.params.id),
      stocks: stocksStore.getUserStocks(request.params.id).reverse()
      };
   response.render("dashboard", viewData);
  },
  async searchStocks(request, response){
    let searchParam = request.body.search;
    console.log("This is search Param:" + searchParam );
    const result = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchParam}&apikey=C34LLCPBG7XECGUG`);
    const data = await result.json();
    const viewData = {
      title: "Stocks List",
      stocks:data["bestMatches"]
    };
    response.render("showAllStocks", viewData);
  },
  unfollow(request, response){
    //const loggedInUser = accounts.getCurrentUser(request);
    const stocksId = request.params.id;
    logger.debug(`Deleting Stocks ${stocksId}`);
    stocksStore.removeStock(stocksId);
    response.redirect("/dashboard/");
  },
  follow(request, response){
    const loggedInUser = accounts.getCurrentUser(request);
    let following = false;
    const newStock = {
      id: uuid.v1(),
      userId: loggedInUser.id,
      name: request.params.name,
      code: request.params.code,
      price: request.params.matchScore,
      following: following
    };
    //logger.debug("Adding a new Stock", newStock);
    const userStocks = stocksStore.getUserStocks(loggedInUser.id);

    if(userStocks.length > 0) {
      for (let x = 0; x < userStocks.length; x++) {
        logger.info("Users stock codes: " + userStocks[x].code + " request.params.code: " + request.params.code);
        if (userStocks[x].code === request.params.code) {
          following = true;
          userStocks[x].following = true;
          break;
        }
      }
      if (following == false) {
        stocksStore.addStock(newStock);
      }
    }else{
      stocksStore.addStock(newStock);
    }
    response.redirect("/dashboard/showallstocks");
  },
};

module.exports = dashboard;

