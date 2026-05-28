var urlDaAPI = "http://localhost:3333";

var usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
if (!usuarioLogado) window.location.href = "/autenticacao.html";

fetch(urlDaAPI + "/usuarios/perfil/" + usuarioLogado.idusuario)
    .then(function (r) { return r.json(); })
    .then(function (perfil) {
        preencherHero(perfil);
        preencherBandas(perfil.bandas);

        return fetch(urlDaAPI + "/usuarios/recomendacoes/" + usuarioLogado.idusuario);
    })
    .then(function (r) { return r.json(); })
    .then(function (recs) {
        preencherRecomendacoes(recs);
    })
    .catch(function (erro) {
        console.log("Erro:", erro);
        document.getElementById("rec-grid").innerHTML =
            '<div class="rec-loading">Erro de conexão. A API está rodando?</div>';
    });

function preencherHero(perfil) {
    var estilos = perfil.estilos || [];
    var bandas  = perfil.bandas  || [];

    document.getElementById("stat-estilos").textContent = estilos.length;
    document.getElementById("stat-bandas").textContent  = bandas.length;

    var tagsContainer = document.getElementById("estilos-tags");

    if (estilos.length === 0) {
        document.getElementById("hero-estilos").style.display = "none";
        return;
    }

    estilos.forEach(function (e) {
        var pill = document.createElement("div");
        pill.className   = "estilo-pill";
        pill.textContent = e.nome;
        tagsContainer.appendChild(pill);
    });
}

function preencherRecomendacoes(recs) {
    var grid = document.getElementById("rec-grid");
    grid.innerHTML = "";

    document.getElementById("stat-rec").textContent = recs ? recs.length : 0;

    if (!recs || recs.length === 0) {
        grid.innerHTML =
            '<div class="rec-vazio">' +
                '<div class="rec-vazio-titulo">ARQUIVO EM DIA</div>' +
                '<div class="rec-vazio-desc">' +
                    'Você já tem as bandas mais populares dos seus estilos, ou ainda não cadastrou estilos.<br>' +
                    'Atualize seu perfil em <a href="/dashboard/dashboard.html">Minha Conta</a>.' +
                '</div>' +
            '</div>';
        return;
    }

    var maxPop = 0;
    for (var j = 0; j < recs.length; j++) {
        var p = parseInt(recs[j].popularidade) || 0;
        if (p > maxPop) maxPop = p;
    }
    if (maxPop === 0) maxPop = 1;

    var total = recs.length;

    for (var i = 0; i < recs.length; i++) {
        var banda  = recs[i];
        var pop    = parseInt(banda.popularidade) || 0;
        var popRel = pop / maxPop;

        var scorePosicao = ((total - i) / total) * 60;
        var scorePop     = popRel * 40;
        var score        = Math.round(scorePosicao + scorePop);

        var dotsAtivos = Math.round(popRel * 5);
        var dotsHtml   = "";
        for (var d = 0; d < 5; d++) {
            dotsHtml += '<div class="rec-pop-dot' + (d < dotsAtivos ? " ativo" : "") + '"></div>';
        }

        var card = document.createElement("div");
        card.className = "rec-card";
        card.innerHTML =
            '<div class="rec-card-bg">0' + (i + 1) + "</div>" +
            '<div class="rec-card-vertente">' + (banda.vertente || "—") + "</div>" +
            '<div class="rec-card-nome">' + banda.nome + "</div>" +
            '<div class="rec-compat">' +
                '<div class="rec-compat-topo">' +
                    '<span class="rec-compat-label">Compatibilidade</span>' +
                    '<span class="rec-compat-num">' + score + '%</span>' +
                '</div>' +
                '<div class="rec-compat-track">' +
                    '<div class="rec-compat-fill" style="width:0%" data-pct="' + score + '"></div>' +
                '</div>' +
            '</div>' +
            '<div class="rec-pop">' +
                dotsHtml +
                '<span class="rec-pop-txt">' + pop + ' usuário' + (pop !== 1 ? 's' : '') + ' curtem</span>' +
            '</div>';

        grid.appendChild(card);
    }

    setTimeout(function () {
        var barras = document.querySelectorAll(".rec-compat-fill");
        for (var b = 0; b < barras.length; b++) {
            barras[b].style.width = barras[b].getAttribute("data-pct") + "%";
        }
    }, 150);
}

function preencherBandas(bandas) {
    var container = document.getElementById("bandas-lista");
    container.innerHTML = "";

    if (!bandas || bandas.length === 0) {
        container.innerHTML = '<span class="vazio-txt">Nenhuma banda no seu arquivo ainda.</span>';
        return;
    }

    for (var i = 0; i < bandas.length; i++) {
        var tag = document.createElement("div");
        tag.className   = "banda-tag";
        tag.textContent = bandas[i].nome;
        container.appendChild(tag);
    }
}