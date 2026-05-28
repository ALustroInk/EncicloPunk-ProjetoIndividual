var database = require("../database/config");

function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT u.idusuario, u.nome, u.email, u.tipo_usuario, u.criado_em, e.cidade, e.estado
        FROM usuario u
            INNER JOIN endereco e ON u.endereco_idendereco = e.idendereco
        WHERE u.email = '${email}' AND u.senha = '${senha}';
    `;
    return database.executar(instrucaoSql);
}

function cadastrar(nome, email, senha, cidade, estado) {
    var instrucaoEndereco = `INSERT INTO endereco (cidade, estado) VALUES ('${cidade}', '${estado}');`;
    return database.executar(instrucaoEndereco)
        .then(function (resultadoEndereco) {
            var idEndereco = resultadoEndereco.insertId;
            var instrucaoUsuario = `
                INSERT INTO usuario (nome, email, senha, endereco_idendereco)
                VALUES ('${nome}', '${email}', '${senha}', ${idEndereco});
            `;
            return database.executar(instrucaoUsuario);
        });
}

function salvarEstilos(idusuario, estilosNomes) {
    if (!estilosNomes || estilosNomes.length === 0) return Promise.resolve();
    var promessas = estilosNomes.map(function (nome) {
        return database.executar(`SELECT idvertente FROM vertente WHERE nome = '${nome}' LIMIT 1;`)
            .then(function (resultado) {
                if (resultado.length === 0) return;
                var idvertente = resultado[0].idvertente;
                return database.executar(`
                    INSERT IGNORE INTO usuario_vertente (usuario_idusuario, vertente_idvertente)
                    VALUES (${idusuario}, ${idvertente});
                `);
            });
    });
    return Promise.all(promessas);
}

function salvarBandas(idusuario, bandasNomes) {
    if (!bandasNomes || bandasNomes.length === 0) return Promise.resolve();
    var promessas = bandasNomes.map(function (nome) {
        return database.executar(`SELECT idbanda FROM banda WHERE nome = '${nome}' LIMIT 1;`)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    return resultado[0].idbanda;
                } else {
                    return database.executar(`
                        SELECT v.idvertente FROM vertente v
                        INNER JOIN banda b ON b.vertente_idvertente = v.idvertente
                        WHERE b.nome LIKE '%${nome}%'
                        LIMIT 1;
                    `).then(function (vertRes) {
                        var idVertente = vertRes.length > 0 ? vertRes[0].idvertente : 'NULL';
                        return database.executar(`INSERT INTO banda (nome, vertente_idvertente) VALUES ('${nome}', ${idVertente});`)
                            .then(function (res) { return res.insertId; });
                    });
                }
            })
            .then(function (idbanda) {
                return database.executar(`
                    INSERT IGNORE INTO usuario_banda (usuario_idusuario, banda_idbanda)
                    VALUES (${idusuario}, ${idbanda});
                `);
            });
    });
    return Promise.all(promessas);
}

function buscarPerfil(idusuario) {
    var sqlEstilos = `
        SELECT v.idvertente, v.nome
        FROM usuario_vertente uv
            INNER JOIN vertente v ON uv.vertente_idvertente = v.idvertente
        WHERE uv.usuario_idusuario = ${idusuario};
    `;
    var sqlBandas = `
        SELECT b.idbanda, b.nome
        FROM usuario_banda ub
            INNER JOIN banda b ON ub.banda_idbanda = b.idbanda
        WHERE ub.usuario_idusuario = ${idusuario};
    `;
    var sqlAcessos = `
        SELECT p.nome AS pagina, a.acessado_em
        FROM acesso a
            INNER JOIN pagina p ON a.pagina_idpagina = p.idpagina
        WHERE a.usuario_idusuario = ${idusuario}
        ORDER BY a.acessado_em DESC
        LIMIT 5;
    `;
    return Promise.all([
        database.executar(sqlEstilos),
        database.executar(sqlBandas),
        database.executar(sqlAcessos)
    ]).then(function (resultados) {
        return { estilos: resultados[0], bandas: resultados[1], acessos: resultados[2] };
    });
}

function buscarRecomendacoes(idusuario) {
    var sqlVertentes = `
        SELECT vertente_idvertente
        FROM usuario_vertente
        WHERE usuario_idusuario = ${idusuario};
    `;
    return database.executar(sqlVertentes)
        .then(function (vertentes) {
            if (vertentes.length === 0) {
                var sqlPopulares = `
                    SELECT b.idbanda, b.nome,
                           v.nome AS vertente,
                           COUNT(ub.usuario_idusuario) AS popularidade
                    FROM banda b
                        LEFT JOIN vertente v ON b.vertente_idvertente = v.idvertente
                        LEFT JOIN usuario_banda ub ON b.idbanda = ub.banda_idbanda
                    WHERE b.idbanda NOT IN (
                        SELECT COALESCE(banda_idbanda, 0) FROM usuario_banda WHERE usuario_idusuario = ${idusuario}
                    )
                    GROUP BY b.idbanda, b.nome, v.nome
                    ORDER BY popularidade DESC
                    LIMIT 6;
                `;
                return database.executar(sqlPopulares);
            }

            var listaIds = "";
            for (var i = 0; i < vertentes.length; i++) {
                if (i > 0) listaIds += ",";
                listaIds += vertentes[i].vertente_idvertente;
            }

            var sqlRecomendacoes = `
                SELECT b.idbanda, b.nome,
                       v.nome AS vertente,
                       COUNT(ub.usuario_idusuario) AS popularidade
                FROM banda b
                    INNER JOIN vertente v ON b.vertente_idvertente = v.idvertente
                    LEFT JOIN usuario_banda ub ON b.idbanda = ub.banda_idbanda
                WHERE b.vertente_idvertente IN (${listaIds})
                AND b.idbanda NOT IN (
                    SELECT COALESCE(banda_idbanda, 0) FROM usuario_banda WHERE usuario_idusuario = ${idusuario}
                )
                GROUP BY b.idbanda, b.nome, v.nome
                ORDER BY popularidade DESC
                LIMIT 6;
            `;
            return database.executar(sqlRecomendacoes);
        });
}

function registrarAcesso(idusuario, nomePagina) {

    var sqlBuscaPagina = `SELECT idpagina FROM pagina WHERE nome = '${nomePagina}' LIMIT 1;`;
    return database.executar(sqlBuscaPagina)
        .then(function (resultado) {
            if (resultado.length === 0) return; 
            var idpagina = resultado[0].idpagina;
            return database.executar(`
                INSERT INTO acesso (usuario_idusuario, pagina_idpagina)
                VALUES (${idusuario}, ${idpagina});
            `);
        });
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