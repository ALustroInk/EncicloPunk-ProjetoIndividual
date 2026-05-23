var database = require("../database/config");

function buscarDados() {

    var sqlTotalUsuarios = `
        SELECT COUNT(*) AS total
        FROM usuario
        WHERE tipo_usuario = 'usuario';
    `;

    var sqlTotalAcessos = `
        SELECT COUNT(*) AS total
        FROM acesso;
    `;

    var sqlPaginaTop = `
        SELECT p.nome AS pagina, COUNT(*) AS total
        FROM acesso a
            INNER JOIN pagina p ON a.pagina_idpagina = p.idpagina
        GROUP BY p.idpagina, p.nome
        ORDER BY total DESC
        LIMIT 1;
    `;

    var sqlEstadosAtivos = `
        SELECT COUNT(DISTINCT e.estado) AS total
        FROM usuario u
            INNER JOIN endereco e ON u.endereco_idendereco = e.idendereco
        WHERE u.tipo_usuario = 'usuario';
    `;

    var sqlEstilos = `
        SELECT v.nome, COUNT(*) AS total
        FROM usuario_vertente uv
            INNER JOIN vertente v ON uv.vertente_idvertente = v.idvertente
        GROUP BY v.idvertente, v.nome
        ORDER BY total DESC
        LIMIT 5;
    `;

    var sqlBandas = `
        SELECT b.nome, COUNT(*) AS total
        FROM usuario_banda ub
            INNER JOIN banda b ON ub.banda_idbanda = b.idbanda
        GROUP BY b.idbanda, b.nome
        ORDER BY total DESC
        LIMIT 5;
    `;

    var sqlEstados = `
        SELECT e.estado, COUNT(*) AS total
        FROM usuario u
            INNER JOIN endereco e ON u.endereco_idendereco = e.idendereco
        WHERE u.tipo_usuario = 'usuario'
        GROUP BY e.estado
        ORDER BY total DESC;
    `;

    // Últimos 10 acessos
    var sqlAcessos = `
        SELECT
            u.nome AS usuario,
            p.nome AS pagina,
            e.cidade,
            e.estado,
            a.acessado_em
        FROM acesso a
            INNER JOIN usuario u ON a.usuario_idusuario = u.idusuario
            INNER JOIN pagina p  ON a.pagina_idpagina = p.idpagina
            INNER JOIN endereco e ON u.endereco_idendereco = e.idendereco
        ORDER BY a.acessado_em DESC
        LIMIT 10;
    `;

    var sqlAcessosPorPagina = `
        SELECT p.nome AS pagina, COUNT(*) AS total
        FROM acesso a
            INNER JOIN pagina p ON a.pagina_idpagina = p.idpagina
        GROUP BY p.idpagina, p.nome
        ORDER BY total DESC;
    `;

    return Promise.all([
        database.executar(sqlTotalUsuarios),
        database.executar(sqlTotalAcessos),
        database.executar(sqlPaginaTop),
        database.executar(sqlEstadosAtivos),
        database.executar(sqlEstilos),
        database.executar(sqlBandas),
        database.executar(sqlEstados),
        database.executar(sqlAcessos),
        database.executar(sqlAcessosPorPagina)
    ]).then(function (resultados) {
        return {
            totalUsuarios:    resultados[0][0].total,
            totalAcessos:     resultados[1][0].total,
            paginaTop:        resultados[2][0] || { pagina: "—", total: 0 },
            estadosAtivos:    resultados[3][0].total,
            estilos:          resultados[4],
            bandas:           resultados[5],
            estados:          resultados[6],
            acessos:          resultados[7],
            acessosPorPagina: resultados[8]
        };
    });
}

module.exports = {
    buscarDados
};