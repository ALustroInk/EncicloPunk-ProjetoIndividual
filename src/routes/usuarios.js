var express = require("express");
var router  = express.Router();
var usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar",  function (req, res) { usuarioController.cadastrar(req, res);  });
router.post("/autenticar", function (req, res) { usuarioController.autenticar(req, res); });
router.post("/estilos",    function (req, res) { usuarioController.salvarEstilos(req, res); });
router.post("/bandas",     function (req, res) { usuarioController.salvarBandas(req, res);  });

router.get("/perfil/:idusuario",         function (req, res) { usuarioController.buscarPerfil(req, res);          });
router.get("/recomendacoes/:idusuario",  function (req, res) { usuarioController.buscarRecomendacoes(req, res);   });

module.exports = router;