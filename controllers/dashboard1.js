"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const stocksStore = require("../models/stocks-store.js");
const user = require("../models/user.js");


const uuid = require("uuid");

const dashboard1 = {
  index(request, response) {
    logger.info("dashboard1 rendering");
    const loggedInUser = accounts.getCurrentUser(request);

    const viewData = {
      title: "Stocks List",
      stocks: stocksStore.getUserAssessments(loggedInUser.id).reverse(),
      user: user.getUserById(loggedInUser.id)
    };
    logger.info("about to render", viewData);
    response.render("dashboard1", viewData);
  },

  deleteAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const stocksId = request.params.id;
    logger.debug(`Deleting Assessment ${stocksId}`);
    stocksStore.removeAssessment(stocksId);
    response.redirect("/dashboard1");
  },

  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);

    const newAssessment = {
      id: uuid.v1(),
      userId: loggedInUser.id,
      date: new Date().toString().substring(4, 16),
      time: new Date().toString().substring(16, 25)
    };
    logger.debug("Adding a new Assessment", newAssessment);
    stocksStore.addAssessment(newAssessment);
    response.redirect("/dashboard1");
  },
  loadUserGoalPage(request, response){
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: "Add User Goal",
      user:loggedInUser
    }
    response.render("setGoal", viewData);
  },
  setUserGoal(request, response){
    const loggedInUser = accounts.getCurrentUser(request);
    gymUtility.setGoal(loggedInUser.id, request.body.goal);
    //gymUtility.isGoalReached(loggedInUser.id);
    response.redirect("/dashboard1");
  }
};

module.exports = dashboard1;

