const validateBody = require("./validateBody")
const isValidId = require('../middlewares/isValidId');
const validateFavourite = require('../middlewares/validateFavourite')
const authentificate = require("../middlewares/authentificate");

module.exports = {
    validateBody,
    isValidId,
    validateFavourite,
    authentificate,
}