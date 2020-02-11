const express = require("express");
const router = express.Router();

const RoleController = require('./controllers');

router.get("/all", RoleController.all);

router.post("/create", RoleController.create);

router.get("/routes", RoleController.all_routes);

router.delete("/:roleId", RoleController.delete);

router.patch("/update", RoleController.update);

module.exports = router;
