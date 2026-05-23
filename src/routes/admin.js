var express = require("express");
var router  = express.Router();

var adminController = require("../controllers/adminController");

router.get("/dados", function (req, res) {
    adminController.buscarDados(req, res);
});

module.exports = router;