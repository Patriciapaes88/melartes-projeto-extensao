

//removendo e adicionando produtos do carrinho//
let carrinho = [];
let total = 0;
//adiciona item ao carrinho//
function adicionarCarrinho(nome, preco) {
  carrinho.push({ nome, preco });
  atualizarCarrinho();
}
//remove item ao carrinho//
function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}
//atualiza lista do carrinho
function atualizarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  lista.innerHTML = "";
   total = 0;

  carrinho.forEach((item, index) => {
    total += item.preco;
    const li = document.createElement("li");
    li.innerHTML = `${item.nome} - R$ ${item.preco.toFixed(2)} <span class="carrinho-x" onclick="removerItem(${index})">❌</span>`;
    lista.appendChild(li);
  });

  document.getElementById("total").textContent = total.toFixed(2);
}
// Exibe produtos cadastrados dinamicamente na vitrine
document.addEventListener('DOMContentLoaded', function () {
  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  const ocultos = JSON.parse(localStorage.getItem('ocultos')) || [];
  const container = document.getElementById('produtos');

  if (!container) return;

  // ✅ Filtra produtos com imagem válida
  const produtosFiltrados = produtos.filter((p, index, self) => {
    const temImagem = Array.isArray(p.imagens)
      ? p.imagens.length > 0
      : typeof p.imagem === 'string' && p.imagem.trim() !== '';

    const naoOculto = !ocultos.includes(p.nome);

    // ✅ Remove duplicados por nome + categoria
    const primeiroIndex = self.findIndex(x => x.nome === p.nome && x.categoria === p.categoria);
    const naoDuplicado = primeiroIndex === index;

    return temImagem && naoOculto && naoDuplicado;
  });

  produtosFiltrados.forEach((produto) => {
    const card = document.createElement('div');
    card.className = `produto-card ${produto.categoria} catalogo-card`;

    card.innerHTML = `
      <div class="galeria-produto">
        ${Array.isArray(produto.imagens)
          ? produto.imagens.map(img => `<img class="imagem-principal" src="${img}" alt="${produto.nome}" onclick="ampliarImagem('${img}')">`).join('')
          : `<img class="imagem-principal" src="${produto.imagem}" alt="${produto.nome}" onclick="ampliarImagem('${produto.imagem}')">`}
        <span class="favorito" onclick="marcarFavorito(this,'${produto.nome}')">🤍</span>
        <h3>${produto.nome}</h3>
      </div>
      <p>R$ ${produto.preco.toFixed(2)}</p>
      <button onclick="adicionarCarrinho('${produto.nome}', ${produto.preco})">Adicionar ao carrinho</button>
    `;

    container.appendChild(card);
  });
});

  // Oculta produtos fixos do HTML
  document.querySelectorAll('.produto-card').forEach(card => {
    const nome = card.querySelector('h3')?.textContent.trim();
    if (ocultos.includes(nome)) {
      card.style.display = 'none';
    }
  });


function finalizarCompra() {
  const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
  let mensagem = 'Olá Amelia! 💛\nGostaria de comprar as seguintes peças:\n\n';

 if (carrinho.length > 0) {
    carrinho.forEach(prod => {
      mensagem += `• ${prod.nome} – R$ ${prod.preco.toFixed(2)}\n`;
    });
    mensagem += `\nTotal: R$ ${total.toFixed(2)}\n\n`;
  } else {
    mensagem += '(Carrinho vazio)\n\n';
  }

  if (favoritos.length > 0) {
    mensagem += '❤️ O cliente curtiu:\n';
    favoritos.forEach(item => {
      mensagem += `• ${item}\n`;
    });
  }
  const link = `https://wa.me/5567991250954?text=${encodeURIComponent(mensagem)}`;
  window.open(link);
}

function abrirCarrinho() {
  document.getElementById('carrinho').classList.remove('oculto');
}


function fecharCarrinho() {
  document.getElementById('carrinho').classList.add('oculto');
}
document.addEventListener('click', function(event) {
  const carrinho = document.getElementById('carrinho');
  const abriuCarrinho = event.target.closest('[onclick="abrirCarrinho()"]');

  // Se o carrinho está visível
  if (carrinho && !carrinho.classList.contains('oculto')) {
    const clicouFora = !carrinho.contains(event.target) && !abriuCarrinho;

    if (clicouFora) {
      fecharCarrinho();
    }
  }
});


//trocar as imagens//
function trocarImagem(imgId, src) {
  document.getElementById(imgId).src = src;
}
//mostra o zoom da img//
function ampliarImagem(src) {
  const zoom = document.getElementById("zoom");
  const zoomImg = document.getElementById("zoom-img");
  zoomImg.src = src;
   zoom.style.display = "flex";
  
}
//fecha o zoom
function fecharZoom() {
  
 const zoom = document.getElementById("zoom");
 zoom.style.display = "none";
  }

//garante que o zoom esteja oculto ao carregar//
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("zoom").classList.add("zoom-oculto");
});



function filtrarProdutos(categoria) {
  const ocultos = JSON.parse(localStorage.getItem('ocultos')) || [];
  const cards = document.querySelectorAll('.produto-card');

  cards.forEach(card => {
    const nome = card.querySelector('h3')?.textContent.trim();
    const estaOculto = ocultos.includes(nome);

    if (estaOculto) {
      card.style.display = 'none';
    } else if (categoria === 'todos') {
      card.style.display = 'block';
    } else if (card.classList.contains(categoria)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}


// botao de buscar//
function buscarProduto() {
  const termo = document.getElementById('barraBusca').value.toLowerCase();
  const cards = document.querySelectorAll('.produto-card');

  cards.forEach(card => {
    const texto = card.innerText.toLowerCase();
      card.style.display = texto.includes(termo) ? 'block' : 'none';
    });
    
}
  const produtos = [
    'Toalha Bordada',
    'Tapete de Crochê',
    'Boneca de Pano',
    'Blusa Adulto',
    'Bolsa Artesanal',
    'Cachecol',
    'Jogo de toalha'
  ];

  function mostrarSugestoes() {
    const entrada = document.getElementById('barraBusca').value.toLowerCase();
    const lista = document.getElementById('sugestoes');
    lista.innerHTML = '';

    if (entrada === '') {
      lista.style.display = 'none';
      return;
    }

    const sugestõesFiltradas = produtos.filter(produto =>
      produto.toLowerCase().includes(entrada)
    );

    sugestõesFiltradas.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      li.addEventListener('click', function() {
        document.getElementById('barraBusca').value = item;
        lista.style.display = 'none';
        buscarProduto(); // aplica filtro direto
      });
      lista.appendChild(li);
    });

    lista.style.display = sugestõesFiltradas.length ? 'block' : 'none';
  }

  // Focar campo ao clicar na lupa///
document.querySelector('.icone-lupa').addEventListener('click', function() {
   document.querySelector('#barraBusca').focus();
});
document.getElementById('barraBusca').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      buscarProduto();
    }
  });
  
/*botao favoritos*/

let favoritos = [];

function marcarFavorito(elemento, nome) {
  const index = favoritos.indexOf(nome);
   if (index === -1) {
    favoritos.push(nome);
    elemento.textContent = '❤️';
    elemento.classList.add('ativo');
  } else {
    favoritos.splice(index, 1);
    elemento.textContent = '🤍';
    elemento.classList.remove('ativo');
  }
}
 

function marcarFavorito(elemento, nome) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');

  if (!favoritos.includes(nome)) {
    favoritos.push(nome);
    elemento.textContent = '❤️';
    elemento.classList.add('ativo');
  } else {
    favoritos = favoritos.filter(item => item !== nome);
    elemento.textContent = '🤍';
    elemento.classList.remove('ativo');
  }

  localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

//dececta quando cliente sai da pag e memanda msg//
window.addEventListener('beforeunload', () => {
  const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');

  if (favoritos.length > 0) {
    const mensagem = favoritos.map(prod => `• ${prod}`).join('%0A');
    const link = `https://wa.me/5567991250954?text=Olá Amelia!%0AO cliente gostou dos seguintes produtos:%0A${mensagem}`;
    
    window.open(link);
  }
});
/*avaliacaoes*/
const dadosAvaliacao = {
  total: 0,
  somaNotas: 0,
  estrelas: [0, 0, 0, 0, 0, 0]
};

function registrarAvaliacao(nota) {
  dadosAvaliacao.total++;
  dadosAvaliacao.somaNotas += nota;
  dadosAvaliacao.estrelas[nota]++;
  atualizarInterface();
}

function atualizarInterface() {
  if (dadosAvaliacao.total === 0) return;

  const media = (dadosAvaliacao.somaNotas / dadosAvaliacao.total).toFixed(1);
  document.getElementById('mediaGeral').textContent =
    `Média geral: ⭐ ${media} de 5 (${dadosAvaliacao.total} avaliação${dadosAvaliacao.total > 1 ? 's' : ''})`;

  const grafico = document.getElementById('grafico-estrelas');
  grafico.innerHTML = '';

  for (let i = 5; i >= 0; i--) {
    const qtd = dadosAvaliacao.estrelas[i];
    const porcentagem = ((qtd / dadosAvaliacao.total) * 100).toFixed(1);
    const barra = document.createElement('div');
    barra.innerHTML = `${i} estrela${i !== 1 ? 's' : ''}: ${porcentagem}% 
      <progress value="${qtd}" max="${dadosAvaliacao.total}"></progress>`;
    grafico.appendChild(barra);
  }
}

function avaliarEstrela(estrelaClicada) {
  const estrelas = document.querySelectorAll('.estrelas-simples span');
  const nota = [...estrelas].indexOf(estrelaClicada) + 1;

  estrelas.forEach((el, idx) => {
    el.classList.toggle('selecionado', idx < nota);
  });

  localStorage.setItem('avaliacao-unica', nota);
  registrarAvaliacao(nota);

  document.getElementById('mensagem-avaliacao').textContent =
    `⭐ Você avaliou com ${nota} estrela${nota > 1 ? 's' : ''}. Obrigada pelo carinho! 💛`;
}

window.addEventListener('DOMContentLoaded', () => {
  const notaSalva = parseInt(localStorage.getItem('avaliacao-unica'));
  if (!isNaN(notaSalva)) {
    const estrelas = document.querySelectorAll('.estrelas-simples span');
    estrelas.forEach((el, idx) => {
      el.classList.toggle('selecionado', idx < notaSalva);
    });
    registrarAvaliacao(notaSalva);
    document.getElementById('mensagem-avaliacao').textContent =
      `⭐ Você já avaliou com ${notaSalva} estrela${notaSalva > 1 ? 's' : ''}. Obrigada pelo carinho! 💛`;
  }
});

  window.addEventListener('beforeunload', () => {
 /* localStorage.removeItem('avaliacao-unica');*/
});

/*catalogo*/
function abrirAbaCatalogo(categoria) {
  filtrarProdutos(categoria); // ativa filtro desejado

  // rola até os filtros, não só os produtos
  document.querySelector('#filtros').scrollIntoView({ behavior: 'smooth' });
}

//contato oculto//
 // Ativa ou desativa a exibição da seção "contato"
  document.querySelector('a[href="#contato"]').addEventListener('click', function(e) {
    e.preventDefault();
    const secao = document.getElementById('contato');
    secao.classList.toggle('oculto');
  });

  // Fecha ao clicar fora
  document.addEventListener("click", function(event) {
    const secao = document.getElementById("contato");
    const linkContato = document.querySelector('a[href="#contato"]');

    // Verifica se o clique foi fora da seção e fora do botão de ativar
    if (!secao.classList.contains('oculto') &&
        !secao.contains(event.target) &&
        !linkContato.contains(event.target)) {
      secao.classList.add('oculto');
    }
  });
  

//parte amelia
// ✅ Função global para liberar o painel da artesã
function verificarSenha() {
  const senha = document.getElementById('senha')?.value;
  if (senha === 'melartes2025') {
    document.getElementById('painel-admin').style.display = 'block';
    atualizarLista();
  } else {
    alert('Senha incorreta!');
  }
}

// ✅ Tudo dentro de um único DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form-produto');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nome = document.getElementById('nome').value.trim();
      const preco = parseFloat(document.getElementById('preco').value);
      const categoria = 'diversos';
      const imagemInput = document.getElementById('imagem');
      const arquivo = imagemInput.files[0];

      if (!nome || isNaN(preco) || !arquivo) {
        alert('Preencha todos os campos corretamente.');
        return;
      }

      const reader = new FileReader();
      reader.onload = function () {
        const imagemBase64 = reader.result;
        const novoProduto = { nome, preco, imagens: [imagemBase64], categoria };
        const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        produtos.push(novoProduto);
        localStorage.setItem('produtos', JSON.stringify(produtos));
        alert('Produto adicionado com sucesso!');
        form.reset();
        atualizarLista(); // ✅ ESSENCIAL
      };

      reader.readAsDataURL(arquivo);
    });
  }

  // ✅ Atualiza lista de produtos para remoção
  function atualizarLista() {
    const lista = document.getElementById('lista-produtos');
    if (!lista) return;
    lista.innerHTML = '';
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    produtos.forEach((produto, index) => {
      const item = document.createElement('li');
      item.textContent = `${produto.nome} - R$ ${produto.preco.toFixed(2)}`;
      const btn = document.createElement('button');
      btn.textContent = 'Remover';
      btn.style.marginLeft = '10px';
      btn.onclick = () => {
        produtos.splice(index, 1);
        localStorage.setItem('produtos', JSON.stringify(produtos));
        atualizarLista();
        alert('Produto removido!');
      };
      item.appendChild(btn);
      lista.appendChild(item);
    });
  }

  

  

  // Oculta produto da vitrine
  const ocultarInput = document.getElementById('nome-ocultar');
  const ocultarBtn = ocultarInput?.nextElementSibling;
  if (ocultarBtn) {
    ocultarBtn.addEventListener('click', function () {
      const nome = ocultarInput.value.trim();
      if (!nome) return;
      const ocultos = JSON.parse(localStorage.getItem('ocultos')) || [];
      if (!ocultos.includes(nome)) {
        ocultos.push(nome);
        localStorage.setItem('ocultos', JSON.stringify(ocultos));
        alert(`Produto "${nome}" ocultado da vitrine.`);
        ocultarInput.value = '';
      }
    });
  }

  // Chama a função de atualização ao carregar
  atualizarLista();
});



document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('produtos');
  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  const ocultos = JSON.parse(localStorage.getItem('ocultos')) || [];

  // Captura nomes dos produtos fixos
  const nomesFixos = Array.from(document.querySelectorAll('.produto-card.fixo h3'))
    .map(el => el.textContent.trim());

  produtos.forEach(produto => {
    if (ocultos.includes(produto.nome)) return;
    if (nomesFixos.includes(produto.nome)) return; // pula duplicados

    // Aqui começa o código que monta o card dinâmico
    const card = document.createElement('div');
    card.className = `produto-card ${produto.categoria} catalogo-card`;

    const galeria = document.createElement('div');
    galeria.className = 'galeria-produto';

    const imgPrincipal = document.createElement('img');
    imgPrincipal.src = produto.imagens[0];
    imgPrincipal.alt = produto.nome;
    imgPrincipal.className = 'imagem-principal';
    imgPrincipal.onclick = () => ampliarImagem(imgPrincipal.src);
    galeria.appendChild(imgPrincipal);

    if (produto.imagens.length > 1) {
      const miniaturas = document.createElement('div');
      miniaturas.className = 'miniaturas';

      produto.imagens.forEach((src, index) => {
        if (index === 0) return;
        const mini = document.createElement('img');
        mini.src = src;
        mini.alt = produto.nome;
        mini.onclick = () => {
          imgPrincipal.src = src;
        };
        miniaturas.appendChild(mini);
      });

      galeria.appendChild(miniaturas);
    }

    const favorito = document.createElement('span');
    favorito.className = 'favorito';
    favorito.textContent = '🤍';
    favorito.onclick = () => marcarFavorito(favorito, produto.nome);
    galeria.appendChild(favorito);

    const titulo = document.createElement('h3');
    titulo.textContent = produto.nome;
    galeria.appendChild(titulo);

    card.appendChild(galeria);

    const preco = document.createElement('p');
    preco.textContent = `R$ ${produto.preco.toFixed(2)}`;
    card.appendChild(preco);

    const btnCarrinho = document.createElement('button');
    btnCarrinho.textContent = 'Adicionar ao carrinho';
    btnCarrinho.onclick = () => adicionarCarrinho(produto.nome, produto.preco);
    card.appendChild(btnCarrinho);

    container.appendChild(card);
  });
});


