var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
// quando chegar um POST em /usuarios/cadastrar, vai para o controller
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

// quando chegar um POST em /usuarios/autenticar, vai para o controller
router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

module.exports = router;