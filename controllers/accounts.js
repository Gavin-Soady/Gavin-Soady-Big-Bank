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
    response.render("dashboard", viewData);
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
      response.redirect("/#login");
    }
  },
  getCurrentUser(request) {
    const userEmail = request.cookies.playlist;
    return user.getUserByEmail(userEmail);
  },
};

module.exports = accounts;