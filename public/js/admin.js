var urlDaAPI = "http://localhost:3333";

var usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    window.location.href = "/autenticacao.html";
}
if (usuarioLogado.tipo_usuario !== "admin") {
    window.location.href = "/index.html";
}

// Data atual no topo
var agora = new Date();
document.getElementById("data-atual").textContent =
    agora.toLocaleDateString("pt-BR", {
        weekday: "long", day: "2-digit", month: "long", year: "numeric"
    }).toUpperCase();


fetch(urlDaAPI + "/admin/dados")
    .then(function (resposta) {
        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados do admin: " + resposta.status);
        }
        return resposta.json();
    })
    .then(function (dados) {
        preencherKPIs(dados);
        preencherEstilos(dados.estilos);
        preencherBandas(dados.bandas);
        preencherEstados(dados.estados);
        preencherAcessos(dados.acessos);
        renderizarGrafico(dados.acessosPorPagina);
    })
    .catch(function (erro) {
        console.log("Erro ao carregar dados do admin:", erro);
    });


function preencherKPIs(dados) {
    document.getElementById("kpi-total-usuarios").textContent = dados.totalUsuarios;
    document.getElementById("kpi-total-acessos").textContent  =
        dados.totalAcessos >= 1000
            ? (dados.totalAcessos / 1000).toFixed(1) + "k"
            : dados.totalAcessos;
    document.getElementById("kpi-pagina-top-nome").textContent  = dados.paginaTop.pagina;
    document.getElementById("kpi-pagina-top-count").textContent = dados.paginaTop.total + " acessos";
    document.getElementById("kpi-estados-ativos").textContent   = dados.estadosAtivos;
}


function preencherEstilos(estilos) {
    var container = document.getElementById("estilos-ranking");
    container.innerHTML = "";

    if (!estilos || estilos.length === 0) {
        container.innerHTML = '<span class="sem-dados">Sem dados ainda</span>';
        return;
    }

    var max = estilos[0].total;
    estilos.forEach(function (e, i) {
        var pct = Math.round((e.total / max) * 100);
        container.innerHTML +=
            '<div class="rank-item">' +
                '<span class="rank-pos">' + (i + 1) + "</span>" +
                '<span class="rank-nome">' + e.nome + "</span>" +
                '<div class="rank-track"><div class="rank-fill" style="width:' + pct + '%"></div></div>' +
                '<span class="rank-val">' + e.total + "</span>" +
            "</div>";
    });
}

function preencherBandas(bandas) {
    var container = document.getElementById("bandas-ranking");
    container.innerHTML = "";

    if (!bandas || bandas.length === 0) {
        container.innerHTML = '<span class="sem-dados">Sem dados ainda</span>';
        return;
    }

    var max = bandas[0].total;
    bandas.forEach(function (b, i) {
        var pct = Math.round((b.total / max) * 100);
        container.innerHTML +=
            '<div class="rank-item">' +
                '<span class="rank-pos">' + (i + 1) + "</span>" +
                '<span class="rank-nome">' + b.nome + "</span>" +
                '<div class="rank-track"><div class="rank-fill gold" style="width:' + pct + '%"></div></div>' +
                '<span class="rank-val">' + b.total + "</span>" +
            "</div>";
    });
}

function preencherEstados(estados) {
    var container = document.getElementById("estados-grid");
    container.innerHTML = "";

    if (!estados || estados.length === 0) {
        container.innerHTML = '<span class="sem-dados">Sem dados ainda</span>';
        return;
    }

    var max = estados[0].total;
    estados.forEach(function (e) {
        var pct = Math.round((e.total / max) * 100);
        container.innerHTML +=
            '<div class="estado-item">' +
                '<div class="estado-sigla">' + e.estado + "</div>" +
                '<div class="estado-num">' + e.total + " usr</div>" +
                '<div class="estado-bar"><div class="estado-bar-fill" style="width:' + pct + '%"></div></div>' +
            "</div>";
    });
}


function preencherAcessos(acessos) {
    var tbody = document.getElementById("acessos-tbody");
    tbody.innerHTML = "";

    if (!acessos || acessos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="sem-dados">Nenhum acesso registrado</td></tr>';
        return;
    }

    // Considera "recente" qualquer acesso das últimas 2 horas
    var agora = new Date();

    acessos.forEach(function (a) {
        var dataAcesso    = new Date(a.acessado_em);
        var diffHoras     = (agora - dataAcesso) / (1000 * 60 * 60);
        var recente       = diffHoras < 2;
        var dataFormatada = dataAcesso.toLocaleDateString("pt-BR") +
            " " + dataAcesso.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

        tbody.innerHTML +=
            "<tr>" +
                '<td><span class="tdot' + (recente ? " on" : "") + '"></span>' +
                    (recente ? "Recente" : "Normal") + "</td>" +
                "<td>" + a.usuario + "</td>" +
                '<td><span class="page-pill">' + a.pagina + "</span></td>" +
                "<td>" + a.cidade + " · " + a.estado + "</td>" +
                "<td>" + dataFormatada + "</td>" +
            "</tr>";
    });
}


function renderizarGrafico(acessosPorPagina) {
    var canvas = document.getElementById("grafico-acessos");
    if (!canvas) return;

    // Se não vier da API ainda, usa os dados do paginaTop que já temos
    // A query completa de acessosPorPagina será adicionada no adminModel
    var labels = [];
    var valores = [];

    if (acessosPorPagina && acessosPorPagina.length > 0) {
        acessosPorPagina.forEach(function (item) {
            labels.push(item.pagina);
            valores.push(item.total);
        });
    } else {
        // fallback com dados simulados caso o endpoint ainda não retorne esse campo
        labels  = ["Música", "Vertentes", "História", "Home", "Sobre"];
        valores = [312, 198, 154, 89, 45];
    }

    new Chart(canvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Acessos",
                data: valores,
                backgroundColor: [
                    "rgba(204, 26, 26, 0.8)",
                    "rgba(204, 26, 26, 0.6)",
                    "rgba(204, 26, 26, 0.45)",
                    "rgba(204, 26, 26, 0.3)",
                    "rgba(204, 26, 26, 0.2)",
                ],
                borderColor: "rgba(204, 26, 26, 1)",
                borderWidth: 1,
                borderRadius: 0,
            }]
        },
        options: {
            indexAxis: "y",   // barras horizontais
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#1c1c1c",
                    borderColor: "#333",
                    borderWidth: 1,
                    titleColor: "#f0ece0",
                    bodyColor: "#888",
                    titleFont: { family: "'Share Tech Mono', monospace", size: 11 },
                    bodyFont:  { family: "'Share Tech Mono', monospace", size: 11 },
                    callbacks: {
                        label: function (ctx) {
                            return "  " + ctx.parsed.x + " acessos";
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid:  { color: "#1e1e1e" },
                    ticks: {
                        color: "#444",
                        font: { family: "'Share Tech Mono', monospace", size: 10 }
                    },
                    border: { color: "#2a2a2a" }
                },
                y: {
                    grid:  { display: false },
                    ticks: {
                        color: "#888",
                        font: { family: "'Bebas Neue', sans-serif", size: 14 },
                        letterSpacing: 2
                    },
                    border: { color: "#2a2a2a" }
                }
            }
        }
    });
}

function fazerLogout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "/autenticacao.html";
}