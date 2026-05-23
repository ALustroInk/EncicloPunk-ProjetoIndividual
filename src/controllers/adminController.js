var adminModel = require("../models/adminModel");

function buscarDados(req, res) {
    adminModel.buscarDados()
        .then(function (dados) {
            res.json(dados);
        })
        .catch(function (erro) {
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    buscarDados
};