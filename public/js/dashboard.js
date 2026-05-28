var urlDaAPI = "http://localhost:3333";

var usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    window.location.href = "/autenticacao.html";
}

if (usuarioLogado.tipo_usuario === "admin") {
    window.location.href = "/dashboard/admin.html";
}

document.getElementById("avatar-inicial").textContent = usuarioLogado.nome.charAt(0).toUpperCase();
document.getElementById("perfil-nome").textContent    = usuarioLogado.nome.toUpperCase();
document.getElementById("perfil-email").textContent   = usuarioLogado.email;
document.getElementById("perfil-desde").textContent   = new Date(usuarioLogado.criado_em).getFullYear();

fetch(urlDaAPI + "/usuarios/perfil/" + usuarioLogado.idusuario)
    .then(function (resposta) { return resposta.json(); })
    .then(function (perfil) {
        preencherEstilos(perfil.estilos);
        preencherBandas(perfil.bandas);
        preencherAcessos(perfil.acessos);

        document.getElementById("count-estilos").textContent = perfil.estilos.length;
        document.getElementById("count-bandas").textContent  = perfil.bandas.length;
        document.getElementById("badge-estilos").textContent = perfil.estilos.length;
        document.getElementById("badge-bandas").textContent  = perfil.bandas.length;
    })
    .catch(function (erro) {
        console.log("Erro ao carregar perfil:", erro);
    });

fetch(urlDaAPI + "/usuarios/recomendacoes/" + usuarioLogado.idusuario)
    .then(function (resposta) { return resposta.json(); })
    .then(function (recs) {
        preencherRecomendacoes(recs);
    })
    .catch(function (erro) {
        console.log("Erro ao carregar recomendações:", erro);
    });


function preencherEstilos(estilos) {
    var container = document.getElementById("estilos-lista");
    container.innerHTML = "";

    if (estilos.length === 0) {
        container.innerHTML = '<span class="tag-vazio">Nenhum estilo selecionado</span>';
        return;
    }

    for (var i = 0; i < estilos.length; i++) {
        var tag = document.createElement("span");
        tag.className   = i === 0 ? "tag destaque" : "tag";
        tag.textContent = estilos[i].nome;
        container.appendChild(tag);
    }
}

function preencherBandas(bandas) {
    var container = document.getElementById("bandas-lista");
    container.innerHTML = "";

    if (bandas.length === 0) {
        container.innerHTML = '<span class="tag-vazio">Nenhuma banda adicionada</span>';
        return;
    }

    for (var i = 0; i < bandas.length; i++) {
        var tag = document.createElement("span");
        tag.className   = "tag gold";
        tag.textContent = bandas[i].nome;
        container.appendChild(tag);
    }
}

function preencherAcessos(acessos) {
    var container = document.getElementById("atividade-lista");
    container.innerHTML = "";

    if (acessos.length === 0) {
        container.innerHTML = '<div class="tag-vazio">Nenhum acesso registrado ainda</div>';
        return;
    }

    var icones = {
        "Home":      "🏠︎",
        "História":  "🕮",
        "Vertentes": "⩜⃝",
        "Música":    "♪",
        "Sobre":     "ⓘ"
    };

    for (var i = 0; i < acessos.length; i++) {
        var a    = acessos[i];
        var data = new Date(a.acessado_em);
        var dataFormatada = data.toLocaleDateString("pt-BR") +
            " · " + data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        var icone = icones[a.pagina] || "◈";

        container.innerHTML +=
            '<div class="atividade-item">' +
                '<div class="ativ-icone">' + icone + "</div>" +
                '<div class="ativ-texto"><strong>' + a.pagina + "</strong> · Página visitada</div>" +
                '<div class="ativ-data">' + dataFormatada + "</div>" +
            "</div>";
    }
}

function preencherRecomendacoes(recs) {
    var container = document.getElementById("rec-lista");
    container.innerHTML = "";

    if (!recs || recs.length === 0) {
        container.innerHTML =
            '<div style="color:#444;font-family:monospace;font-size:1rem;padding:1rem;">' +
                'Cadastre estilos no perfil para ver recomendações.' +
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

    var limite = recs.length < 3 ? recs.length : 3;

    for (var i = 0; i < limite; i++) {
        var banda        = recs[i];
        var pop          = parseInt(banda.popularidade) || 0;
        var scorePosicao = ((total - i) / total) * 60;
        var scorePop     = (pop / maxPop) * 40;
        var score        = Math.round(scorePosicao + scorePop);

        var d = document.createElement("div");
        d.className = "rec-card";
        d.innerHTML =
            '<div class="rec-num">0' + (i + 1) + "</div>" +
            '<div class="rec-nome">' + banda.nome + "</div>" +
            '<span class="rec-tag">' + (banda.vertente || "—") + "</span>" +
            '<div class="rec-compat">' + score + "% compatível</div>";
        container.appendChild(d);
    }

    var link = document.createElement("a");
    link.href      = "/musica.html";
    link.className = "rec-ver-todas";
    link.textContent = "Ver todas as recomendações →";
    container.appendChild(link);
}

function fazerLogout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "/autenticacao.html";
}