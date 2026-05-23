// Verifica se tem alguém logado. Se não tiver, manda para a página de login
function verificarLogin() {
    var usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        window.location.href = '/autenticacao.html';
    }
}

// Se estiver logado mostra perfil com o nome do usuário, se não mostra login
function atualizarHeader() {
    var navPerfil = document.getElementById('nav-perfil');
    if (!navPerfil) return;

    var usuarioLogado = localStorage.getItem('usuarioLogado');

    if (usuarioLogado) {
        var usuario = JSON.parse(usuarioLogado);
        var destino = usuario.tipo_usuario === "admin"
            ? "/dashboard/admin.html"
            : "/dashboard/dashboard.html";

        navPerfil.innerHTML = `
            <a href="${destino}" class="btn-perfil">
                <img src="/imgs/user.png" alt="Perfil" class="icone-perfil">
                <span>${usuario.nome.split(' ')[0]}</span>
            </a>
        `;
    } else {
        // se não estiver logado, mostra o login
        navPerfil.innerHTML = `
            <a href="/autenticacao.html">Login</a>
        `;
    } 
}

// Faz logout: apaga o usuário do localStorage e volta para o login
function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = '/autenticacao.html';
}

// Quando a página terminar de carregar, atualiza o header automaticamente
window.addEventListener('DOMContentLoaded', function () {
    atualizarHeader();
});