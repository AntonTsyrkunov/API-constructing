const validateBody = require("./validateBody");
const isValidId = require('../middlewares/isValidId');
const validateFavourite = require('../middlewares/validateFavourite');
const authentificate = require("../middlewares/authentificate");
const upload = require("./upload");

module.exports = {
    validateBody,
    isValidId,
    validateFavourite,
    authentificate,
    upload,
}