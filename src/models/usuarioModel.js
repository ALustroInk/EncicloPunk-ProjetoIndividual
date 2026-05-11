var database = require("../database/config");

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function autenticar(): ", email, senha);

    var instrucaoSql = `
        SELECT
            u.idusuario,
            u.nome,
            u.email,
            u.tipo_usuario,
            u.criado_em,
            e.cidade,
            e.estado
        FROM usuario u
            INNER JOIN endereco e
                ON u.endereco_idendereco = e.idendereco
        WHERE u.email = '${email}' AND u.senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nome, email, senha, cidade, estado) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, cidade, estado);

    // Primeiro INSERT: cria o endereço e pega o id gerado
    var instrucaoEndereco = `
        INSERT INTO endereco (cidade, estado) VALUES ('${cidade}', '${estado}');
    `;
    console.log("Executando a instrução SQL (endereço): \n" + instrucaoEndereco);

    return database.executar(instrucaoEndereco)
        .then(function (resultadoEndereco) {

            // insertId é o id gerado automaticamente pelo banco para o endereço que acabamos de criar
            var idEndereco = resultadoEndereco.insertId;

            // Segundo INSERT: cria o usuário usando o id do endereço acima
            var instrucaoUsuario = `
                INSERT INTO usuario (nome, email, senha, endereco_idendereco)
                VALUES ('${nome}', '${email}', '${senha}', ${idEndereco});
            `;
            console.log("Executando a instrução SQL (usuário): \n" + instrucaoUsuario);

            return database.executar(instrucaoUsuario);
        });
}

module.exports = {
    autenticar,
    cadastrar
};