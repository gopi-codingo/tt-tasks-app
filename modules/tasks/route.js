const express = require("express");
const ctrl = require("./ctrl");
const router = express.Router();
const prefix = "/tasks";


router.post(prefix, ctrl.validate("create"), ctrl.create);

router.put(prefix + "/:taskId", ctrl.validate("edit"), ctrl.edit);

router.get(prefix + "/list", ctrl.validate("list"), ctrl.list);

router.get(prefix + "/:taskId", ctrl.validate("view"), ctrl.view);

module.exports = router;