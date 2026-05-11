    var estilos = ['Punk Rock', 'Hardcore', 'Oi!', 'Punk Brasileiro'];
    var bandas  = ['Ramones', 'Ratos de Porão', 'Black Flag', 'Garotos Podres', 'Misfits'];
    var recs = [
      { nome: 'Subhumans',     vertente: 'Anarcho Punk' },
      { nome: 'Discharge',     vertente: 'Hardcore'     },
      { nome: 'The Exploited', vertente: 'UK82'         },
      { nome: 'GBH',           vertente: 'Street Punk'  },
      { nome: 'Crass',         vertente: 'Anarcho Punk' },
      { nome: 'Minor Threat',  vertente: 'Hardcore'     },
    ];
    var atividade = [
      { icone: '♪', pagina: 'Música',    detalhe: 'Explorou discografias', data: 'Hoje, 14:32' },
      { icone: '✦', pagina: 'Vertentes', detalhe: 'Leu sobre Riot Grrrl',  data: 'Hoje, 12:10' },
      { icone: '◈', pagina: 'História',  detalhe: 'Acessou cronologia',    data: 'Ontem, 20:45' },
    ];

    estilos.forEach(function(e) {
      var t = document.createElement('span');
      t.className = 'tag';
      t.textContent = e;
      document.getElementById('estilos-lista').appendChild(t);
    });

    bandas.forEach(function(b) {
      var t = document.createElement('span');
      t.className = 'tag gold';
      t.textContent = b;
      document.getElementById('bandas-lista').appendChild(t);
    });

    recs.forEach(function(r, i) {
      var d = document.createElement('div');
      d.className = 'rec-card';
      d.innerHTML =
        '<div class="rec-num">0' + (i+1) + '</div>' +
        '<div class="rec-nome">' + r.nome + '</div>' +
        '<span class="rec-tag">' + r.vertente + '</span>';
      document.getElementById('rec-lista').appendChild(d);
    });

    atividade.forEach(function(a) {
      document.getElementById('atividade-lista').innerHTML +=
        '<div class="atividade-item">' +
          '<div class="ativ-icone">' + a.icone + '</div>' +
          '<div class="ativ-texto"><strong>' + a.pagina + '</strong> · ' + a.detalhe + '</div>' +
          '<div class="ativ-data">' + a.data + '</div>' +
        '</div>';
    });

    function fazerLogout() {
      localStorage.removeItem('usuarioLogado');
      window.location.href = 'autenticacao.html';
    }