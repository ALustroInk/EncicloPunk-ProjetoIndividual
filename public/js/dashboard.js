var urlDaAPI = "http://localhost:3333";

var usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    window.location.href = "/autenticacao.html";
}

if (usuarioLogado.tipo_usuario === "admin") {
    window.location.href = "/dashboard/admin.html";
}
 
document.getElementById("avatar-inicial").textContent =
    usuarioLogado.nome.charAt(0).toUpperCase();


document.getElementById("perfil-nome").textContent =
    usuarioLogado.nome.toUpperCase();
document.getElementById("perfil-email").textContent =
    usuarioLogado.email;


var anoCadastro = new Date(usuarioLogado.criado_em).getFullYear();
document.getElementById("perfil-desde").textContent = anoCadastro;


fetch(urlDaAPI + "/usuarios/perfil/" + usuarioLogado.idusuario)
    .then(function (resposta) {
        if (!resposta.ok) {
            throw new Error("Erro ao buscar perfil: " + resposta.status);
        }
        return resposta.json();
    })
    .then(function (perfil) {

        preencherEstilos(perfil.estilos);
        preencherBandas(perfil.bandas);
        preencherAcessos(perfil.acessos);

   
        var totalEstilos = perfil.estilos.length;
        var totalBandas  = perfil.bandas.length;

        document.getElementById("count-estilos").textContent = totalEstilos;
        document.getElementById("count-bandas").textContent  = totalBandas;
        document.getElementById("badge-estilos").textContent = totalEstilos;
        document.getElementById("badge-bandas").textContent  = totalBandas;
    })
    .catch(function (erro) {
        console.log("Erro ao carregar perfil:", erro);
    });


function preencherEstilos(estilos) {
    var container = document.getElementById("estilos-lista");
    container.innerHTML = "";

    if (estilos.length === 0) {
        container.innerHTML = '<span class="tag-vazio">Nenhum estilo selecionado</span>';
        return;
    }

    estilos.forEach(function (e, i) {
        var tag = document.createElement("span");

        tag.className = i === 0 ? "tag destaque" : "tag";
        tag.textContent = e.nome;
        container.appendChild(tag);
    });
}


function preencherBandas(bandas) {
    var container = document.getElementById("bandas-lista");
    container.innerHTML = "";

    if (bandas.length === 0) {
        container.innerHTML = '<span class="tag-vazio">Nenhuma banda adicionada</span>';
        return;
    }

    bandas.forEach(function (b) {
        var tag = document.createElement("span");
        tag.className = "tag gold";
        tag.textContent = b.nome;
        container.appendChild(tag);
    });
}


function preencherAcessos(acessos) {
    var container = document.getElementById("atividade-lista");
    container.innerHTML = "";

    if (acessos.length === 0) {
        container.innerHTML = '<div class="tag-vazio">Nenhum acesso registrado ainda</div>';
        return;
    }

    var icones = {
        "Home":      "◈",
        "História":  "◉",
        "Vertentes": "✦",
        "Música":    "♪",
        "Sobre":     "◎"
    };

    acessos.forEach(function (a) {

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
    });
}


var recs = [
    { nome: "Subhumans",     vertente: "Anarcho Punk" },
    { nome: "Discharge",     vertente: "Hardcore"     },
    { nome: "The Exploited", vertente: "UK82"         },
    { nome: "GBH",           vertente: "Street Punk"  },
    { nome: "Crass",         vertente: "Anarcho Punk" },
    { nome: "Minor Threat",  vertente: "Hardcore"     },
];

recs.forEach(function (r, i) {
    var d = document.createElement("div");
    d.className = "rec-card";
    d.innerHTML =
        '<div class="rec-num">0' + (i + 1) + "</div>" +
        '<div class="rec-nome">' + r.nome + "</div>" +
        '<span class="rec-tag">' + r.vertente + "</span>";
    document.getElementById("rec-lista").appendChild(d);
});


function fazerLogout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "/autenticacao.html";
}