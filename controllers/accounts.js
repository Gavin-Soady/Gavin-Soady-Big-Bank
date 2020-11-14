"use strict";

const user = require("../models/user");
const logger = require("../utils/logger");
const uuid = require("uuid");

const accounts = {
  index(request, response) {
    const viewData = {
      title: "Welcome to BigBank"
    };
    response.render("index", viewData);
  },
  login(request, response) {
    const viewData = {
      title: "Welcome to BigBank"
    };
    response.render("login", viewData);
  },
  logout(request, response) {
    response.cookie("user", "");
    response.redirect("/");
  },
  signup(request, response) {
    const viewData = {
      title: "BigBank"
    };
    response.render("signup", viewData);
  },
  register(request, response) {
    const newUser = request.body;
    newUser.id = uuid.v1();
    user.addUser(newUser );
    response.redirect("/");
  },
  authenticate(request, response) {
    const userCheck = user.getUserByEmail(request.body.email);
    if (userCheck && userCheck.password == request.body.password) {
      response.cookie("playlist", userCheck.email);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },
  getCurrentUser(request) {
    const userEmail = request.cookies.playlist;
    return user.getUserByEmail(userEmail);
  },
  loadSettingsPage(request,response){
    const viewData = {
      title: "Update settings",
      user: user.getUserById(request.params.id)
    };
    response.render("settings", viewData);

  },
  updateSettings(request,response){

    const updateUser = user.getUserByEmail(request.body.email);
    updateUser.name = request.body.name;
    logger.info(`logging in ${updateUser.name}`);
    updateUser.gender = request.body.gender;
    updateUser.email = request.body.email;
    updateUser.password = request.body.password;
    updateUser.address = request.body.address;
    updateUser.height = request.body.height;
    updateUser.startingWeight = request.body.startingWeight;

     response.redirect("/dashboard");

  },
};

module.exports = accounts;