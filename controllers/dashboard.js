"use strict";

const accounts = require("./accounts.js");
//const _ = require("lodash");
const logger = require("../utils/logger");
const stocksStore = require("../models/stocks-store.js");
//const allStocks = require("../models/allStocks.js");
const user = require("../models/user.js");
const uuid = require("uuid");
const fetch = require('node-fetch');
const https = require('https');


const dashboard = {
  async index(request, response) {
    //logger.info("dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    let searchParam;
    if(request.body.search){
      searchParam = request.body.search;
    }
    if(request.params.search){
      searchParam = request.params.search;
    }
    console.log("This is search Param:" + searchParam );
    let showSearch = false;
    let userStocks = stocksStore.getUserStocks(loggedInUser.id).reverse();
    let apiCallsDepleted=false;
    let buttonColour
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchParam}&apikey=C34LLCPBG7XECGUG`;
    const result = await fetch(url);
    const data = await result.json();
    if(data["bestMatches"].length >0) {
        showSearch = true;
    }
    if(data["bestMatches"].length > 0) {
      for (let z = 0; z < data["bestMatches"].length; z++) {
        data["bestMatches"][z]['following'] = 'Follow';
      }
      for (let x = 0; x < data["bestMatches"].length; x++) {
        for (let y = 0; y < userStocks.length; y++) {
          if (data["bestMatches"][x]['1. symbol'] == userStocks[y].code) {
            data["bestMatches"][x]['following'] = 'Following';
            data["bestMatches"][x]['buttonColour'] = "grey";
            break;
          }
        }
      }
    }
    console.log("Call return: "+ data["bestMatches"]);
    console.log("buttonColour: "+ buttonColour);
    const viewData = {
      title: "Dashboard",
      user: loggedInUser,
      userStocks: userStocks,
      stocks: data["bestMatches"],
      search: searchParam,
      showSearch:showSearch,
      apiCallsDepleted:apiCallsDepleted,
      buttonColour: buttonColour
  };
    //logger.info(viewData.stocks);
    response.render("dashboard", viewData);
  },
  unfollow(request, response){
    //const loggedInUser = accounts.getCurrentUser(request);
    const stocksId = request.params.id;
    logger.debug(`Deleting Stocks ${stocksId}`);
    stocksStore.removeStock(stocksId);
    response.redirect("/dashboard/");
  },
  follow(request, response){
    console.log(request.params.search);
    const loggedInUser = accounts.getCurrentUser(request);
    let following = false;
    const newStock = {
      id: uuid.v1(),
      userId: loggedInUser.id,
      name: request.params.name,
      code: request.params.code,
      matchScore: request.params.matchScore,
      marketOpen: request.params.marketOpen,
      marketClosed: request.params.marketClosed,
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
      if (following === false) {
        stocksStore.addStock(newStock);
      }
    }else{
      stocksStore.addStock(newStock);
    }
    response.redirect("/dashboard/"+request.params.search);
  },
};

module.exports = dashboard;

