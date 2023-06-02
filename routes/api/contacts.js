const express = require("express");

const router = express.Router();

const controller = require("../../controllers/contacts");

const {validateBody, isValidId, validateFavourite, authentificate} = require("../../middlewares");

const {schemas} = require("../../models/contact")

router.get("/", authentificate, controller.getAllContacts);

router.get("/:contactId", authentificate, isValidId, controller.getContactById);

router.post("/", authentificate, validateBody(schemas.addSchema), controller.postContact);

router.delete("/:contactId", authentificate, isValidId, controller.deleteContact);

router.put("/:contactId", isValidId, validateBody(schemas.addSchema), controller.putContact);

router.patch("/:contactId/favourite", authentificate, isValidId, validateFavourite(schemas.updateFavouriteSchema), controller.updateFavourite)

module.exports = router;
