const express = require("express");

const controller = require("../../controllers/auth");

const {validateBody, authentificate, upload} =require('../../middlewares');

const {schemas} = require('../../models/user')

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), controller.register);

router.get("verify/:verificationToken", controller.verifyEmail);

router.post("/verify", validateBody(schemas.verifySchema),  controller.resendVerifyEmail);

router.post("/login", validateBody(schemas.loginSchema), controller.login);

router.get("/current", authentificate, controller.getCurrent);

router.post("/logout", authentificate, controller.logout );

router.patch("/avatars", authentificate, upload.single("avatar"), controller.updateAvatar);


module.exports = router;