var urlDaAPI = "http://localhost:3333";

function verificarLogin() {
    var usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        window.location.href = '/autenticacao.html';
    }
}

function atualizarHeader() {
    var navPerfil = document.getElementById('nav-perfil');
    if (!navPerfil) return;

    var usuarioLogado = localStorage.getItem('usuarioLogado');

    if (usuarioLogado) {
        var usuario = JSON.parse(usuarioLogado);
        var destino = usuario.tipo_usuario === "admin"
            ? "/dashboard/admin.html"
            : "/dashboard/dashboard.html";

        navPerfil.innerHTML =
            '<a href="' + destino + '" class="btn-perfil">' +
                '<img src="/imgs/user.png" alt="Perfil" class="icone-perfil">' +
                '<span>' + usuario.nome.split(' ')[0] + '</span>' +
            '</a>';
    } else {
        navPerfil.innerHTML = '<a href="/autenticacao.html">Login</a>';
    }
}

function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = '/autenticacao.html';
}

function registrarAcesso() {
    var usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) return; 

    var usuario = JSON.parse(usuarioLogado);
    if (usuario.tipo_usuario === 'admin') return; 

    var mapeamento = {
        'index.html':     'Home',
        '/':              'Home',
        'historia.html':  'História',
        'vertentes.html': 'Vertentes',
        'musica.html':    'Música',
        'sobre.html':     'Sobre'
    };

    var caminho = window.location.pathname;
    
    var arquivo = caminho.split('/').pop();
    if (arquivo === '') arquivo = '/';

    var nomePagina = mapeamento[arquivo];
    if (!nomePagina) return; 

    fetch(urlDaAPI + "/usuarios/acesso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            idusuario: usuario.idusuario,
            pagina:    nomePagina
        })
    }).catch(function () {

    });
}

window.addEventListener('DOMContentLoaded', function () {
    atualizarHeader();
    registrarAcesso();
});