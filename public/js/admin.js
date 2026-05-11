// DATA ATUAL
    var agora = new Date();
    document.getElementById('data-atual').textContent =
      agora.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase();

    // DADOS MOCKADOS
    var estilos = [
      { nome: 'Punk Rock',       count: 35 },
      { nome: 'Hardcore',        count: 28 },
      { nome: 'Punk Brasileiro', count: 22 },
      { nome: 'Oi!',             count: 18 },
      { nome: 'Post-Punk',       count: 14 },
    ];
    var bandas = [
      { nome: 'Ramones',        count: 31 },
      { nome: 'Ratos de Porão', count: 27 },
      { nome: 'Black Flag',     count: 21 },
      { nome: 'The Clash',      count: 19 },
      { nome: 'Garotos Podres', count: 16 },
    ];
    var estados = [
      { sigla: 'SP', count: 18 }, { sigla: 'RJ', count: 9  },
      { sigla: 'MG', count: 7  }, { sigla: 'RS', count: 5  },
      { sigla: 'PR', count: 4  }, { sigla: 'BA', count: 4  },
    ];
    var acessos = [
      { usuario: 'João Silva',      pagina: 'Música',    cidade: 'São Paulo',     estado: 'SP', em: '09/05 14:32', recente: true  },
      { usuario: 'Maria Punk',      pagina: 'Vertentes', cidade: 'Rio de Janeiro',estado: 'RJ', em: '09/05 13:55', recente: true  },
      { usuario: 'Zé Crust',        pagina: 'História',  cidade: 'Belo Horizonte',estado: 'MG', em: '09/05 12:10', recente: false },
      { usuario: 'Ana Riot',        pagina: 'Home',      cidade: 'Porto Alegre',  estado: 'RS', em: '09/05 11:47', recente: false },
      { usuario: 'Carlos HC',       pagina: 'Sobre',     cidade: 'Curitiba',      estado: 'PR', em: '09/05 10:30', recente: false },
      { usuario: 'Fernanda Street', pagina: 'Música',    cidade: 'Salvador',      estado: 'BA', em: '08/05 22:15', recente: false },
    ];

    // ESTILOS RANKING
    var maxE = estilos[0].count;
    estilos.forEach(function(e, i) {
      var pct = Math.round((e.count / maxE) * 100);
      document.getElementById('estilos-ranking').innerHTML +=
        '<div class="rank-item">' +
          '<span class="rank-pos">' + (i+1) + '</span>' +
          '<span class="rank-nome">' + e.nome + '</span>' +
          '<div class="rank-track"><div class="rank-fill" style="width:' + pct + '%"></div></div>' +
          '<span class="rank-val">' + e.count + '</span>' +
        '</div>';
    });

    // BANDAS RANKING
    var maxB = bandas[0].count;
    bandas.forEach(function(b, i) {
      var pct = Math.round((b.count / maxB) * 100);
      document.getElementById('bandas-ranking').innerHTML +=
        '<div class="rank-item">' +
          '<span class="rank-pos">' + (i+1) + '</span>' +
          '<span class="rank-nome">' + b.nome + '</span>' +
          '<div class="rank-track"><div class="rank-fill gold" style="width:' + pct + '%"></div></div>' +
          '<span class="rank-val">' + b.count + '</span>' +
        '</div>';
    });

    // ESTADOS
    var maxEst = estados[0].count;
    estados.forEach(function(e) {
      var pct = Math.round((e.count / maxEst) * 100);
      document.getElementById('estados-grid').innerHTML +=
        '<div class="estado-item">' +
          '<div class="estado-sigla">' + e.sigla + '</div>' +
          '<div class="estado-num">' + e.count + ' usr</div>' +
          '<div class="estado-bar"><div class="estado-bar-fill" style="width:' + pct + '%"></div></div>' +
        '</div>';
    });

    // ACESSOS
    acessos.forEach(function(a) {
      document.getElementById('acessos-tbody').innerHTML +=
        '<tr>' +
          '<td><span class="tdot' + (a.recente ? ' on' : '') + '"></span>' + (a.recente ? 'Recente' : 'Normal') + '</td>' +
          '<td>' + a.usuario + '</td>' +
          '<td><span class="page-pill">' + a.pagina + '</span></td>' +
          '<td>' + a.cidade + ' · ' + a.estado + '</td>' +
          '<td>' + a.em + '</td>' +
        '</tr>';
    });

    function fazerLogout() {
      localStorage.removeItem('usuarioLogado');
      window.location.href = 'autenticacao.html';
    }