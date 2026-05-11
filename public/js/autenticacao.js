var urlDaAPI = "http://localhost:3333";

// TROCAR ENTRE LOGIN E CADASTRO
function switchTab(qual) {
  let formLogin = document.getElementById("form-login");
  let formCadastro = document.getElementById("form-cadastro");
  let aba1 = document.querySelectorAll(".tab")[0];
  let aba2 = document.querySelectorAll(".tab")[1];

  if (qual === "login") {
    formLogin.style.display = "flex";
    formCadastro.style.display = "none";
    aba1.classList.add("active");
    aba2.classList.remove("active");
  } else {
    formLogin.style.display = "none";
    formCadastro.style.display = "flex";
    aba2.classList.add("active");
    aba1.classList.remove("active");
  }
}

// STEPS DO CADASTRO
let stepLabels = { 1: "Conta", 2: "Estilos", 3: "Bandas" };

function goStep(numero) {
  if (numero === 2) {
    let ok = validarStep1();
    if (!ok) return;
  }

  document.querySelectorAll(".step").forEach(function (step) {
    step.classList.remove("active");
  });

  document.getElementById("step-" + numero).classList.add("active");

  for (let i = 1; i <= 3; i++) {
    let dot = document.getElementById("dot-" + i);
    dot.classList.remove("active", "done");
    if (i < numero) dot.classList.add("done");
    if (i === numero) dot.classList.add("active");
  }

  document.getElementById("step-label").textContent = stepLabels[numero];
}

// VALIDAÇÕES
function mostrarErro(input, mensagem) {
  let erroVelho = input.parentNode.querySelector(".erro");
  if (erroVelho) erroVelho.remove();

  let erro = document.createElement("span");
  erro.className = "erro";
  erro.textContent = mensagem;
  input.parentNode.appendChild(erro);
  input.style.borderBottomColor = "#cc1a1a";
}

function limparErro(input) {
  let erro = input.parentNode.querySelector(".erro");
  if (erro) erro.remove();
  input.style.borderBottomColor = "";
}

// Valida email e senha com as mesmas regras — usada tanto no cadastro quanto no login
function validarEmail(input) {
  let emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
  if (!emailValido) {
    mostrarErro(input, "E-mail inválido — ex: nome@email.com");
    return false;
  }
  limparErro(input);
  return true;
}

function validarSenha(input) {
  if (input.value.length < 8) {
    mostrarErro(input, "Mínimo 8 caracteres");
    return false;
  } else if (!/[0-9]/.test(input.value)) {
    mostrarErro(input, "Precisa ter pelo menos um número");
    return false;
  } else if (!/[!@#$%^&*]/.test(input.value)) {
    mostrarErro(input, "Precisa ter um caractere especial: ! @ # $ % & *");
    return false;
  }
  limparErro(input);
  return true;
}

function validarStep1() {
  let nome = document.querySelector('#step-1 input[type="text"]');
  let email = document.querySelector('#step-1 input[type="email"]');
  let senha = document.querySelector('#step-1 input[type="password"]');
  let tudo_ok = true;

  if (nome.value.trim() === "") {
    mostrarErro(nome, "Digite seu nome");
    tudo_ok = false;
  } else {
    limparErro(nome);
  }

  if (!validarEmail(email)) tudo_ok = false;
  if (!validarSenha(senha)) tudo_ok = false;

  return tudo_ok;
}

// ESTILOS — selecionar/desselecionar
function toggleTag(botao) {
  botao.classList.toggle("selected");
}

// BANDAS — adicionar e remover
let bandasAdicionadas = [];

function addBandFromSuggestion(botao) {
  let nome = botao.textContent.trim();

  if (bandasAdicionadas.includes(nome)) {
    bandasAdicionadas = bandasAdicionadas.filter(function (b) {
      return b !== nome;
    });
    botao.classList.remove("selected");
    let tag = document.getElementById("tag-" + nome.replace(/\s/g, "-"));
    if (tag) tag.remove();
  } else {
    bandasAdicionadas.push(nome);
    botao.classList.add("selected");
    mostrarTagAdicionada(nome);
  }
}

function addBand() {
  let input = document.getElementById("banda-input");
  let nome = input.value.trim();

  if (nome === "" || bandasAdicionadas.includes(nome)) {
    input.value = "";
    return;
  }

  bandasAdicionadas.push(nome);
  mostrarTagAdicionada(nome);
  input.value = "";
}

function mostrarTagAdicionada(nome) {
  let container = document.getElementById("added-bands");
  let tag = document.createElement("div");
  tag.className = "added-tag";
  tag.id = "tag-" + nome.replace(/\s/g, "-");
  tag.innerHTML =
    nome +
    ' <button type="button" onclick="removerBanda(\'' +
    nome +
    '\')" title="Remover">✕</button>';
  container.appendChild(tag);
}

function removerBanda(nome) {
  bandasAdicionadas = bandasAdicionadas.filter(function (b) {
    return b !== nome;
  });

  let tag = document.getElementById("tag-" + nome.replace(/\s/g, "-"));
  if (tag) tag.remove();

  document
    .querySelectorAll("#bandas-sugestoes .tag-btn")
    .forEach(function (btn) {
      if (btn.textContent.trim() === nome) btn.classList.remove("selected");
    });
}

// FINALIZAR CADASTRO — agora manda para a API
function submitForm() {
  let termos = document.getElementById("termos");

  if (!termos.checked) {
    alert("Você precisa aceitar os termos!");
    return;
  }

  let nome = document.querySelector('#step-1 input[type="text"]').value.trim();
  let email = document
    .querySelector('#step-1 input[type="email"]')
    .value.trim();
  let senha = document.querySelector('#step-1 input[type="password"]').value;

  fetch(urlDaAPI + "/usuarios/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nomeServer: nome,
      emailServer: email,
      senhaServer: senha,
      cidadeServer: "",
      estadoServer: "",
    }),
  })
    .then(function (resposta) {
      if (resposta.ok) {
        // Cadastrou com sucesso — faz login automático
        return fetch(urlDaAPI + "/usuarios/autenticar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emailServer: email,
            senhaServer: senha,
          }),
        });
      } else {
        return resposta.text().then(function (msg) {
          if (msg.includes("Duplicate") || msg.includes("email")) {
            mostrarErro(
              document.querySelector('#step-1 input[type="email"]'),
              "Esse e-mail já está cadastrado!",
            );
            goStep(1);
          } else {
            alert("Erro ao cadastrar: " + msg);
          }
          throw new Error("cadastro falhou");
        });
      }
    })
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (usuario) {
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      window.location.href = "index.html";
    })
    .catch(function (erro) {
      if (erro.message !== "cadastro falhou") {
        alert("Erro de conexão. A API está rodando?");
      }
    });
}

// LOGIN — agora manda para a API
function fazerLogin() {
  let email = document.querySelector('#form-login input[type="email"]');
  let senha = document.querySelector('#form-login input[type="password"]');
  let tudo_ok = true;

  // Mesmas validações do cadastro
  if (!validarEmail(email)) tudo_ok = false;
  if (!validarSenha(senha)) tudo_ok = false;

  if (!tudo_ok) return;

  fetch(urlDaAPI + "/usuarios/autenticar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      emailServer: email.value.trim(),
      senhaServer: senha.value,
    }),
  })
    .then(function (resposta) {
      if (resposta.ok) {
        return resposta.json().then(function (usuario) {
          localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
          window.location.href = "index.html";
        });
      } else {
        mostrarErro(senha, "E-mail ou senha incorretos");
      }
    })
    .catch(function () {
      alert("Erro de conexão. A API está rodando?");
    });
}
