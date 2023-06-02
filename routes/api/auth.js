const express = require("express");

const controller = require("../../controllers/auth");

const {validateBody, authentificate} =require('../../middlewares');

const {schemas} = require('../../models/user')

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), controller.register);

router.post("/login", validateBody(schemas.loginSchema), controller.login);

router.get("/current", authentificate, controller.getCurrent);

router.post("/logout", authentificate, controller.logout )

module.exports = router;