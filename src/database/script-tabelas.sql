CREATE DATABASE arqpunk;
USE arqpunk;

CREATE TABLE endereco (
  idendereco  INT AUTO_INCREMENT PRIMARY KEY,
  cidade      VARCHAR(45),
  estado      CHAR(2)
);

CREATE TABLE usuario (
  idusuario           INT AUTO_INCREMENT PRIMARY KEY,
  nome                VARCHAR(45) NOT NULL,
  email               VARCHAR(45) NOT NULL UNIQUE,
  senha               VARCHAR(45) NOT NULL,
  tipo_usuario        VARCHAR(7) ,
  endereco_idendereco INT NOT NULL,
  criado_em           DATETIME    DEFAULT NOW(),
  FOREIGN KEY (endereco_idendereco) REFERENCES endereco(idendereco)
);

CREATE TABLE vertente (
  idvertente  INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(45) NOT NULL
);

CREATE TABLE pagina (
  idpagina  INT AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(45) NOT NULL
);

CREATE TABLE banda (
  idbanda             INT AUTO_INCREMENT PRIMARY KEY,
  nome                VARCHAR(45) NOT NULL,
  vertente_idvertente INT,
  FOREIGN KEY (vertente_idvertente) REFERENCES vertente(idvertente)
);

CREATE TABLE usuario_vertente (
  usuario_idusuario   INT NOT NULL,
  vertente_idvertente INT NOT NULL,
  PRIMARY KEY (usuario_idusuario, vertente_idvertente),
  FOREIGN KEY (usuario_idusuario)   REFERENCES usuario(idusuario),
  FOREIGN KEY (vertente_idvertente) REFERENCES vertente(idvertente)
);

CREATE TABLE usuario_banda (
  usuario_idusuario INT NOT NULL,
  banda_idbanda     INT NOT NULL,
  PRIMARY KEY (usuario_idusuario, banda_idbanda),
  FOREIGN KEY (usuario_idusuario) REFERENCES usuario(idusuario),
  FOREIGN KEY (banda_idbanda)     REFERENCES banda(idbanda)
);

CREATE TABLE acesso (
  idacesso          INT AUTO_INCREMENT PRIMARY KEY,
  usuario_idusuario INT NOT NULL,
  pagina_idpagina   INT NOT NULL,
  acessado_em       DATETIME DEFAULT NOW(),
  FOREIGN KEY (usuario_idusuario) REFERENCES usuario(idusuario),
  FOREIGN KEY (pagina_idpagina)   REFERENCES pagina(idpagina)
);

-- INSERTS

INSERT INTO vertente (nome) VALUES
('Punk Rock'), ('Hardcore'), ('Oi!'), ('Riot Grrrl'),
('Crust'), ('Street Punk'), ('Post-Punk'), ('Pop Punk'),
('Punk Brasileiro'), ('Anarcho Punk'), ('Skate Punk'), ('UK82');

INSERT INTO pagina (nome) VALUES
('Home'), ('História'), ('Vertentes'), ('Música'), ('Sobre');

INSERT INTO endereco (cidade, estado) VALUES ('São Paulo', 'SP');

-- admin
INSERT INTO usuario (nome, email, senha, tipo_usuario, endereco_idendereco)
VALUES ('Admin', 'admin@arqpunk.com', 'admAndressa2006@', 'admin', 1);

