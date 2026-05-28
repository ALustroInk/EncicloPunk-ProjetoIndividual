var urlDaAPI = "http://localhost:3333";

var usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    window.location.href = "/autenticacao.html";
}
if (usuarioLogado.tipo_usuario !== "admin") {
    window.location.href = "/index.html";
}

var agora = new Date();
document.getElementById("data-atual").textContent =
    agora.toLocaleDateString("pt-BR", {
        weekday: "long", day: "2-digit", month: "long", year: "numeric"
    }).toUpperCase();

fetch(urlDaAPI + "/admin/dados")
    .then(function (resposta) {
        if (!resposta.ok) throw new Error("Erro: " + resposta.status);
        return resposta.json();
    })
    .then(function (dados) {
        preencherKPIs(dados);
        preencherEstilos(dados.estilos);
        preencherBandas(dados.bandas);
        renderizarGraficoEstados(dados.estados);
        renderizarGraficoAcessos(dados.acessosPorPagina);
        preencherAcessos(dados.acessos);
    })
    .catch(function (erro) {
        console.log("Erro ao carregar dados do admin:", erro);
    });

function preencherKPIs(dados) {
    document.getElementById("kpi-total-usuarios").textContent = dados.totalUsuarios;
    document.getElementById("kpi-total-acessos").textContent =
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
    for (var i = 0; i < estilos.length; i++) {
        var pct = Math.round((estilos[i].total / max) * 100);
        container.innerHTML +=
            '<div class="rank-item">' +
                '<span class="rank-pos">' + (i + 1) + "</span>" +
                '<span class="rank-nome">' + estilos[i].nome + "</span>" +
                '<div class="rank-track"><div class="rank-fill" style="width:' + pct + '%"></div></div>' +
                '<span class="rank-val">' + estilos[i].total + "</span>" +
            "</div>";
    }
}

function preencherBandas(bandas) {
    var container = document.getElementById("bandas-ranking");
    container.innerHTML = "";

    if (!bandas || bandas.length === 0) {
        container.innerHTML = '<span class="sem-dados">Sem dados ainda</span>';
        return;
    }

    var max = bandas[0].total;
    for (var i = 0; i < bandas.length; i++) {
        var pct = Math.round((bandas[i].total / max) * 100);
        container.innerHTML +=
            '<div class="rank-item">' +
                '<span class="rank-pos">' + (i + 1) + "</span>" +
                '<span class="rank-nome">' + bandas[i].nome + "</span>" +
                '<div class="rank-track"><div class="rank-fill gold" style="width:' + pct + '%"></div></div>' +
                '<span class="rank-val">' + bandas[i].total + "</span>" +
            "</div>";
    }
}

function renderizarGraficoEstados(estados) {
    var canvas = document.getElementById("grafico-estados");
    if (!canvas) return;

    if (!estados || estados.length === 0) {
        canvas.parentNode.innerHTML =
            '<span class="sem-dados" style="display:block;padding:2rem;text-align:center;">Sem dados de localização ainda</span>';
        return;
    }

    var labels  = [];
    var valores = [];
    for (var i = 0; i < estados.length; i++) {
        labels.push(estados[i].estado);
        valores.push(estados[i].total);
    }

    while (labels.length < 3) {
        labels.push(labels[labels.length - 1]);
        valores.push(valores[valores.length - 1]);
    }

    new Chart(canvas, {
        type: "radar",
        data: {
            labels: labels,
            datasets: [{
                label: "Usuários",
                data: valores,
                backgroundColor: "rgba(204, 26, 26, 0.15)",
                borderColor: "rgba(204, 26, 26, 0.8)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(204, 26, 26, 1)",
                pointBorderColor: "#111",
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
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
                            return "  " + ctx.parsed.r + " usuário" + (ctx.parsed.r !== 1 ? "s" : "");
                        }
                    }
                }
            },
            scales: {
                r: {
                    backgroundColor: "transparent",
                    grid:        { color: "rgba(255,255,255,0.05)" },
                    angleLines:  { color: "rgba(255,255,255,0.05)" },
                    pointLabels: {
                        color: "#888",
                        font: { family: "'Bebas Neue', sans-serif", size: 13 }
                    },
                    ticks: { display: false, stepSize: 1 }
                }
            }
        }
    });
}

function renderizarGraficoAcessos(acessosPorPagina) {
    var canvas = document.getElementById("grafico-acessos");
    if (!canvas) return;

    if (!acessosPorPagina || acessosPorPagina.length === 0) {
        canvas.parentNode.innerHTML =
            '<span class="sem-dados" style="display:block;padding:2rem;text-align:center;">Nenhum acesso registrado ainda — navegue pelas páginas logado para popular</span>';
        return;
    }

    var labels  = [];
    var valores = [];
    for (var i = 0; i < acessosPorPagina.length; i++) {
        labels.push(acessosPorPagina[i].pagina);
        valores.push(acessosPorPagina[i].total);
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
                    "rgba(204, 26, 26, 0.65)",
                    "rgba(204, 26, 26, 0.5)",
                    "rgba(204, 26, 26, 0.35)",
                    "rgba(204, 26, 26, 0.2)"
                ],
                borderColor: "rgba(204, 26, 26, 1)",
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: "y",
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
                    grid: { color: "#1e1e1e" },
                    ticks: {
                        color: "#444",
                        font: { family: "'Share Tech Mono', monospace", size: 10 }
                    },
                    border: { color: "#2a2a2a" }
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        color: "#888",
                        font: { family: "'Bebas Neue', sans-serif", size: 14 }
                    },
                    border: { color: "#2a2a2a" }
                }
            }
        }
    });
}

function preencherAcessos(acessos) {
    var tbody = document.getElementById("acessos-tbody");
    tbody.innerHTML = "";

    if (!acessos || acessos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="sem-dados">Nenhum acesso registrado — navegue pelas páginas logado para popular</td></tr>';
        return;
    }

    var agora = new Date();
    for (var i = 0; i < acessos.length; i++) {
        var a             = acessos[i];
        var dataAcesso    = new Date(a.acessado_em);
        var diffHoras     = (agora - dataAcesso) / (1000 * 60 * 60);
        var recente       = diffHoras < 2;
        var dataFormatada = dataAcesso.toLocaleDateString("pt-BR") +
            " " + dataAcesso.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

        tbody.innerHTML +=
            "<tr>" +
                '<td><span class="tdot' + (recente ? " on" : "") + '"></span>' + (recente ? "Recente" : "Normal") + "</td>" +
                "<td>" + a.usuario + "</td>" +
                '<td><span class="page-pill">' + a.pagina + "</span></td>" +
                "<td>" + a.cidade + " · " + a.estado + "</td>" +
                "<td>" + dataFormatada + "</td>" +
            "</tr>";
    }
}

function fazerLogout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "/autenticacao.html";
}