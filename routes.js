"use strict";

const express = require("express");
const router = express.Router();
const accounts = require("./controllers/accounts.js");
const dashboard = require("./controllers/dashboard.js");

//get
router.get("/", accounts.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.get("/dashboard", dashboard.index);
router.get("/dashboard/:search", dashboard.index);
router.get("/dashboard/unfollow/:id", dashboard.unfollow);
//router.get("/dashboard", dashboard.index);
router.get("/dashboard/follow/:name/:code/:matchScore/:marketOpen/:marketClosed/:search", dashboard.follow);

//post
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);
router.post("/search", dashboard.index);

module.exports = router;
