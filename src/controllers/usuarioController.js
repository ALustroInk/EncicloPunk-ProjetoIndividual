var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    if (email == undefined) { res.status(400).send("Seu email está undefined!"); return; }
    if (senha == undefined) { res.status(400).send("Sua senha está undefined!"); return; }
    usuarioModel.autenticar(email, senha)
        .then(function (resultado) {
            if (resultado.length == 1)      res.json(resultado[0]);
            else if (resultado.length == 0) res.status(403).send("Email e/ou senha inválido(s)");
            else                            res.status(403).send("Mais de um usuário com o mesmo login e senha!");
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrar(req, res) {
    var nome   = req.body.nomeServer;
    var email  = req.body.emailServer;
    var senha  = req.body.senhaServer;
    var cidade = req.body.cidadeServer;
    var estado = req.body.estadoServer;
    if (nome   == undefined) { res.status(400).send("Seu nome está undefined!");   return; }
    if (email  == undefined) { res.status(400).send("Seu email está undefined!");  return; }
    if (senha  == undefined) { res.status(400).send("Sua senha está undefined!");  return; }
    if (cidade == undefined) { res.status(400).send("Sua cidade está undefined!"); return; }
    if (estado == undefined) { res.status(400).send("Seu estado está undefined!"); return; }
    usuarioModel.cadastrar(nome, email, senha, cidade, estado)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) { console.log(erro); res.status(500).json(erro.sqlMessage); });
}

function salvarEstilos(req, res) {
    var idusuario    = req.body.idusuario;
    var estilosNomes = req.body.estilos;
    if (!idusuario || !estilosNomes) { res.status(400).send("idusuario e estilos são obrigatórios"); return; }
    usuarioModel.salvarEstilos(idusuario, estilosNomes)
        .then(function () { res.json({ ok: true }); })
        .catch(function (erro) { console.log(erro); res.status(500).json(erro.sqlMessage); });
}

function salvarBandas(req, res) {
    var idusuario   = req.body.idusuario;
    var bandasNomes = req.body.bandas;
    if (!idusuario || !bandasNomes) { res.status(400).send("idusuario e bandas são obrigatórios"); return; }
    usuarioModel.salvarBandas(idusuario, bandasNomes)
        .then(function () { res.json({ ok: true }); })
        .catch(function (erro) { console.log(erro); res.status(500).json(erro.sqlMessage); });
}

function buscarPerfil(req, res) {
    var idusuario = req.params.idusuario;
    if (!idusuario) { res.status(400).send("ID do usuário não informado!"); return; }
    usuarioModel.buscarPerfil(idusuario)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) { res.status(500).json(erro.sqlMessage); });
}

function buscarRecomendacoes(req, res) {
    var idusuario = req.params.idusuario;
    if (!idusuario) { res.status(400).send("ID do usuário não informado!"); return; }
    usuarioModel.buscarRecomendacoes(idusuario)
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) { res.status(500).json(erro.sqlMessage); });
}

function registrarAcesso(req, res) {
    var idusuario  = req.body.idusuario;
    var nomePagina = req.body.pagina;
    if (!idusuario || !nomePagina) { res.status(400).send("idusuario e pagina são obrigatórios"); return; }
    usuarioModel.registrarAcesso(idusuario, nomePagina)
        .then(function () { res.json({ ok: true }); })
        .catch(function (erro) { console.log(erro); res.status(500).json(erro.sqlMessage); });
}

module.exports = {
    autenticar,
    cadastrar,
    salvarEstilos,
    salvarBandas,
    buscarPerfil,
    buscarRecomendacoes,
    registrarAcesso
};