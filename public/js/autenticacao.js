var urlDaAPI = "http://localhost:3333";

function switchTab(qual) {
  var formLogin    = document.getElementById("form-login");
  var formCadastro = document.getElementById("form-cadastro");
  var aba1 = document.querySelectorAll(".tab")[0];
  var aba2 = document.querySelectorAll(".tab")[1];

  if (qual === "login") {
    formLogin.style.display    = "flex";
    formCadastro.style.display = "none";
    aba1.classList.add("active");
    aba2.classList.remove("active");
  } else {
    formLogin.style.display    = "none";
    formCadastro.style.display = "flex";
    aba2.classList.add("active");
    aba1.classList.remove("active");
  }
}

var stepLabels = { 1: "Conta", 2: "Estilos", 3: "Bandas" };

function goStep(numero) {
  if (numero === 2) {
    if (!validarStep1()) return;
  }

  document.querySelectorAll(".step").forEach(function (s) {
    s.classList.remove("active");
  });
  document.getElementById("step-" + numero).classList.add("active");

  for (var i = 1; i <= 3; i++) {
    var dot = document.getElementById("dot-" + i);
    dot.classList.remove("active", "done");
    if (i < numero)  dot.classList.add("done");
    if (i === numero) dot.classList.add("active");
  }

  document.getElementById("step-label").textContent = stepLabels[numero];
}

function mostrarErro(input, mensagem) {
  var erroVelho = input.parentNode.querySelector(".erro");
  if (erroVelho) erroVelho.remove();
  var erro = document.createElement("span");
  erro.className   = "erro";
  erro.textContent = mensagem;
  input.parentNode.appendChild(erro);
  input.style.borderBottomColor = "#cc1a1a";
}

function limparErro(input) {
  var erro = input.parentNode.querySelector(".erro");
  if (erro) erro.remove();
  input.style.borderBottomColor = "";
}

function validarStep1() {
  var nome   = document.getElementById("cad-nome");
  var email  = document.getElementById("cad-email");
  var senha  = document.getElementById("cad-senha");
  var cidade = document.getElementById("cad-cidade");
  var estado = document.getElementById("cad-estado");
  var ok = true;

  if (nome.value.trim() === "") {
    mostrarErro(nome, "Digite seu nome"); ok = false;
  } else { limparErro(nome); }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    mostrarErro(email, "E-mail inválido — ex: nome@email.com"); ok = false;
  } else { limparErro(email); }

  if (senha.value.length < 8) {
    mostrarErro(senha, "Mínimo 8 caracteres"); ok = false;
  } else if (!/[0-9]/.test(senha.value)) {
    mostrarErro(senha, "Precisa ter pelo menos um número"); ok = false;
  } else if (!/[!@#$%^&*]/.test(senha.value)) {
    mostrarErro(senha, "Precisa ter um caractere especial: ! @ # $ % & *"); ok = false;
  } else { limparErro(senha); }

  if (cidade.value.trim() === "") {
    mostrarErro(cidade, "Digite sua cidade"); ok = false;
  } else { limparErro(cidade); }

  if (estado.value === "") {
    mostrarErro(estado, "Selecione seu estado"); ok = false;
  } else { limparErro(estado); }

  return ok;
}

function toggleTag(botao) {
  botao.classList.toggle("selected");
}

var bandasAdicionadas = [];

function addBandFromSuggestion(botao) {
  var nome = botao.textContent.trim();
  if (bandasAdicionadas.includes(nome)) {
    bandasAdicionadas = bandasAdicionadas.filter(function (b) { return b !== nome; });
    botao.classList.remove("selected");
    var tag = document.getElementById("tag-" + nome.replace(/\s/g, "-"));
    if (tag) tag.remove();
  } else {
    bandasAdicionadas.push(nome);
    botao.classList.add("selected");
    mostrarTagAdicionada(nome);
  }
}

function addBand() {
  var input = document.getElementById("banda-input");
  var nome  = input.value.trim();
  if (nome === "" || bandasAdicionadas.includes(nome)) { input.value = ""; return; }
  bandasAdicionadas.push(nome);
  mostrarTagAdicionada(nome);
  input.value = "";
}

function mostrarTagAdicionada(nome) {
  var container = document.getElementById("added-bands");
  var tag = document.createElement("div");
  tag.className = "added-tag";
  tag.id = "tag-" + nome.replace(/\s/g, "-");
  tag.innerHTML = nome + ' <button type="button" onclick="removerBanda(\'' + nome + '\')" title="Remover">✕</button>';
  container.appendChild(tag);
}

function removerBanda(nome) {
  bandasAdicionadas = bandasAdicionadas.filter(function (b) { return b !== nome; });
  var tag = document.getElementById("tag-" + nome.replace(/\s/g, "-"));
  if (tag) tag.remove();
  document.querySelectorAll("#bandas-sugestoes .tag-btn").forEach(function (btn) {
    if (btn.textContent.trim() === nome) btn.classList.remove("selected");
  });
}

function submitForm() {
  var termos = document.getElementById("termos");
  if (!termos.checked) { alert("Você precisa aceitar os termos!"); return; }

  var nome   = document.getElementById("cad-nome").value.trim();
  var email  = document.getElementById("cad-email").value.trim();
  var senha  = document.getElementById("cad-senha").value;
  var cidade = document.getElementById("cad-cidade").value.trim();
  var estado = document.getElementById("cad-estado").value;

  var estilosSelecionados = Array.from(
    document.querySelectorAll("#estilos-cloud .tag-btn.selected")
  ).map(function (b) { return b.textContent.trim(); });

  var bandasSelecionadas = bandasAdicionadas.slice();

  var idusuarioCadastrado;

  fetch(urlDaAPI + "/usuarios/cadastrar", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nomeServer:   nome,
      emailServer:  email,
      senhaServer:  senha,
      cidadeServer: cidade,
      estadoServer: estado,
    }),
  })
  .then(function (resposta) {
    if (!resposta.ok) {
      return resposta.text().then(function (msg) {
        if (msg.includes("Duplicate") || msg.includes("email")) {
          mostrarErro(document.getElementById("cad-email"), "Esse e-mail já está cadastrado!");
          goStep(1);
        } else {
          alert("Erro ao cadastrar: " + msg);
        }
        throw new Error("cadastro falhou");
      });
    }

    return fetch(urlDaAPI + "/usuarios/autenticar", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailServer: email, senhaServer: senha }),
    });
  })
  .then(function (resposta) { return resposta.json(); })
  .then(function (usuario) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    idusuarioCadastrado = usuario.idusuario;

    var promises = [];

    if (estilosSelecionados.length > 0) {
      promises.push(
        fetch(urlDaAPI + "/usuarios/estilos", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idusuario: idusuarioCadastrado, estilos: estilosSelecionados }),
        })
      );
    }

    if (bandasSelecionadas.length > 0) {
      promises.push(
        fetch(urlDaAPI + "/usuarios/bandas", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idusuario: idusuarioCadastrado, bandas: bandasSelecionadas }),
        })
      );
    }

    return Promise.all(promises);
  })
  .then(function () {
    var usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (usuario.tipo_usuario === "admin") {
      window.location.href = "/dashboard/admin.html";
    } else {
      window.location.href = "/index.html";
    }
  })
  .catch(function (erro) {
    if (erro.message !== "cadastro falhou") {
      alert("Erro de conexão. A API está rodando?");
    }
  });
}

function fazerLogin() {
  var email = document.getElementById("login-email");
  var senha = document.getElementById("login-senha");
  var ok = true;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    mostrarErro(email, "E-mail inválido"); ok = false;
  } else { limparErro(email); }

  if (senha.value.trim() === "") {
    mostrarErro(senha, "Digite sua senha"); ok = false;
  } else { limparErro(senha); }

  if (!ok) return;

  fetch(urlDaAPI + "/usuarios/autenticar", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailServer: email.value.trim(), senhaServer: senha.value }),
  })
  .then(function (resposta) {
    if (resposta.ok) {
      return resposta.json().then(function (usuario) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        if (usuario.tipo_usuario === "admin") {
          window.location.href = "/dashboard/admin.html";
        } else {
          window.location.href = "/index.html";
        }
      });
    } else {
      mostrarErro(senha, "E-mail ou senha incorretos");
    }
  })
}