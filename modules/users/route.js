const express = require("express");
const ctrl    = require("./ctrl");
const router  = express.Router();
const prefix  = "/users";

router.post(prefix + "/signup", ctrl.validate("signup"), ctrl.signup);

router.post(prefix + "/login", ctrl.validate("login"), ctrl.login);

module.exports = router;