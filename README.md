![ArqPunk Banner](./public/imgs/readmeBanner.png)

---

# ArqPunk
 
> O arquivo definitivo do Punk Rock. História, subculturas e Música num só lugar.
 
![Status](https://img.shields.io/badge/Status:-Em%20Desenvolvimento-red?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JS%20%7C%20Node.js%20%7C%20Express%20%7C%20MySQL-black?style=flat-square)
 
---
 
## Sobre o projeto
 
O **ArqPunk** nasceu da necessidade de ter um lugar exclusivo e aberto para documentar e celebrar o punk em todas as suas formas. Aqui você encontra a história do movimento, suas principais subculturas e um recomendador de músicas baseado no seu gosto.
 
Sem algoritmo corporativo. D.I.Y.
 
---
 
## Funcionalidades
 
- **História** - Cronologia do punk do UK76 ao Brasil, com contexto político e cultural.
- **Subculturas** - Hardcore, Oi!, Riot Grrrl, Crust, Street Punk e muito mais.
- **Punk Brasileiro** - Garotos Podres, Inocentes, Ratos de Porão e a cena que merece mais atenção.
- **Recomendador Musical** - Sugere bandas e álbuns com base no que você já curte.
- **Estética & Arte** - A estética visual do movimento e artes da autora do site.
---
 
## </> | Linguagens e Tecnologias (Stack)
 
| Camada | Tecnologia | Descrição |
|--------|------------|----------|
| Frontend | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | HTML para o corpo do site, CSS para o design e Javascript para as funcionalidades|
| Backend | ![Node.js](https://img.shields.io/badge/Node.js-538310?style=flat&logo=node.js&logoColor=white) + ![Express](https://img.shields.io/badge/Express.js-549212?style=flat&logo=express&logoColor=black) | Servidor que processará as requisições do site, como conexão com o Banco e criação de Gráficos |
| Banco de dados |  ![MySQL](https://img.shields.io/badge/MySQL-7f7f7f?style=flat&logo=mysql&logoColor=white) | Armazenamento e manuseio de dados |

---
 
## 📁 Estrutura do projeto
 
arqpunk/
│
├── public/                         Tudo que o navegador acessa
│   │
│   ├── css/
│   │   ├── style.css               Estilo da home e páginas gerais
│   │   ├── styleautent.css         Estilo da tela de login/cadastro
│   │   ├── stylehistoria.css       Estilo de história e vertentes
│   │   ├── stlyledash.css          Estilo da dashboard do usuário
│   │   └── styleadmin.css          Estilo do painel admin
│   │
│   ├── js/
│   │   ├── index.js                Verificação de login + controle do header
│   │   ├── autenticacao.js         Login e cadastro (fetch → API)
│   │   ├── dashboard.js            Dados do usuário
│   │   └── admin.js                Painel admin
│   │
│   ├── imgs/                       Imagens, logos, gifs
│   │
│   ├── dashboard/
│   │   ├── dashboard.html          Página de perfil do usuário logado
│   │   └── admin.html              Painel para admin
│   │
│   ├── index.html                  Home - pública
│   ├── autenticacao.html           Login e cadastro - pública
│   ├── historia.html               Protegida - logado
│   ├── vertentes.html              Protegida - logado
│   ├── musica.html                 Protegida - logado
│   └── sobre.html                  Protegida - logado
│
├── src/                            API - Web-Data-Viz
│   │
│   ├── routes/
│   │   ├── index.js                Rota raiz
│   │   └── usuarios.js             Rotas /usuarios/cadastrar e /autenticar
│   │
│   ├── controllers/
│   │   └── usuarioController.js    Valida os dados e chama o model
│   │
│   ├── models/
│   │   └── usuarioModel.js         Faz as queries no banco MySQL
│   │
│   └── database/
│       ├── config.js               Conexão com o banco
│       └── script-tabelas.sql      SQL ArqPunk
│
│
├── app.js                          Inicia o servidor Express
├── .env                            Credenciais de produção
├── .env.dev                        Credenciais de desenvolvimento
├── package.json                    ---
└── .gitignore                      ---
 
---

-----