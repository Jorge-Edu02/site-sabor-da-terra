// ==================== CONFIGURAÇÕES E VARIÁVEIS GLOBAIS ====================
const FRETE = 8;
let sacolaProdutos = JSON.parse(localStorage.getItem("sacolaSalva")) || [];

// Elementos da Busca
const barraPesquisa = document.getElementById('barraPesquisa');
const iconeLupa = document.getElementById('iconeLupa');
const secaoCestas = document.querySelector('.Espaco_produtos');

// Elementos da Sacola
const itensSacolaContainer = document.querySelector('.itens_sacola');
const totalSacolaContainer = document.querySelector('.total_da_sacola');
const btnAbrirSacola = document.getElementById('abrirSacola');
const btnFecharSacola = document.getElementById('btnFecharSacola');
const menuSacola = document.querySelector('.sacola'); // <-- ADICIONADO: Seleção do menu da sacola (ajuste a classe se necessário)
const btnFinalizarCompra = document.getElementById("finalizarCompra");

// Elementos de Interação de Produtos
const botoesFavoritos = document.querySelectorAll('.curtir');
const botoesComprar = document.querySelectorAll('.Comprar');

// Catálogo de Produtos para Busca
const catalogo = [
    { nome: "Cesta Pequena", pagina: "index.html" },
    { nome: "Cesta Média", pagina: "index.html" },
    { nome: "Cesta Família", pagina: "index.html" },
    { nome: "Banana", pagina: "produtos.html#frutas" },
    { nome: "Morango", pagina: "produtos.html#frutas" },
    { nome: "Uva", pagina: "produtos.html#frutas" },
    { nome: "Tomate", pagina: "produtos.html#frutas" },
    { nome: "Melão", pagina: "produtos.html#frutas" },
    { nome: "Melancia", pagina: "produtos.html#frutas" },
    { nome: "Manga", pagina: "produtos.html#frutas" },
    { nome: "Mamão", pagina: "produtos.html#frutas" },
    { nome: "Maçã", pagina: "produtos.html#frutas" },
    { nome: "Limão", pagina: "produtos.html#frutas" },
    { nome: "Kiwi", pagina: "produtos.html#frutas" },
    { nome: "Abacaxi", pagina: "produtos.html#frutas" },
    { nome: "Requeijão", pagina: "produtos.html#laticinios" },
    { nome: "Manteiga", pagina: "produtos.html#laticinios" },
    { nome: "Leite", pagina: "produtos.html#laticinios" },
    { nome: "Iogurte", pagina: "produtos.html#laticinios" },
    { nome: "Doce", pagina: "produtos.html#laticinios" },
    { nome: "Queijo", pagina: "produtos.html#queijos-artesanais" },
    { nome: "Geleias", pagina: "produtos.html#geleias-artesanais" },
    { nome: "Suco", pagina: "produtos.html#sucos-naturais" },
    { nome: "Couve", pagina: "produtos.html#verduras" },
    { nome: "Rúcula", pagina: "produtos.html#verduras" },
    { nome: "Repolho", pagina: "produtos.html#verduras" },
    { nome: "Salsinha", pagina: "produtos.html#verduras" },
    { nome: "Hortelã", pagina: "produtos.html#verduras" },
    { nome: "Espinafre", pagina: "produtos.html#verduras" },
    { nome: "Coentro", pagina: "produtos.html#verduras" },
    { nome: "Cebolinha verde", pagina: "produtos.html#verduras" },
    { nome: "Almeirão", pagina: "produtos.html#verduras" },
    { nome: "Acelga", pagina: "produtos.html#verduras" },
    { nome: "Cenoura", pagina: "produtos.html#legumes" },
    { nome: "Beterraba", pagina: "produtos.html#legumes" },
    { nome: "Inhame", pagina: "produtos.html#legumes" },
    { nome: "Quiabo", pagina: "produtos.html#legumes" },
    { nome: "Pimentão", pagina: "produtos.html#legumes" },
    { nome: "Pepino", pagina: "produtos.html#legumes" },
    { nome: "Beringela", pagina: "produtos.html#legumes" },
    { nome: "Batata doce", pagina: "produtos.html#legumes" },
    { nome: "Abóbora", pagina: "produtos.html#legumes" },
    { nome: "pães", pagina: "produtos.html#paes-artesanais" },
    { nome: "focácia", pagina: "produtos.html#paes-artesanais" }
];

// ==================== FUNCIONALIDADE DE BUSCA ====================
function executarBusca() {
    let textoDigitado = barraPesquisa.value.toLowerCase().trim();

    if (!textoDigitado) return;

    // Se o usuário buscar por termos genéricos de "cesta", rola a tela (antiga primeira função)
    let palavrasCestas = ['cafe', 'manha', 'café', 'cesta', 'cestas', 'café da manhã', 'pequena', 'media', 'grande', 'familia', 'média', 'família', 'manhã'];
    let ehBuscaCesta = palavrasCestas.some(palavra => textoDigitado.includes(palavra));

    if (ehBuscaCesta && secaoCestas) {
        secaoCestas.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return; // Para aqui se for apenas para rolar a tela
    }

    // Caso contrário, busca e redireciona pelo catálogo
    const resultado = catalogo.find(item =>
        item.nome.toLowerCase().includes(textoDigitado)
    );

    if (resultado) {
        window.location.href = resultado.pagina;
    } else {
        alert(`Nenhum produto encontrado para "${barraPesquisa.value}"`);
    }
}
if (barraPesquisa) {
    barraPesquisa.addEventListener('keydown', (evento) => {
        if (evento.key === 'Enter') executarBusca();
    });
}
if (iconeLupa) {
    iconeLupa.addEventListener('click', executarBusca);
}

// ==================== GERENCIAMENTO DA SACOLA ====================

function atualizarInterfaceSacola() {
    itensSacolaContainer.innerHTML = "";
    let valorTotalAcumulado = 0;

    if (sacolaProdutos.length === 0) {
        itensSacolaContainer.innerHTML = "<p>Sua sacola está vazia.</p>";
        totalSacolaContainer.innerHTML = "<h3>Total: R$ 0,00</h3>";

        // ADICIONADO: Se a sacola esvaziar, também atualiza o localStorage para ficar vazio
        localStorage.setItem("sacolaSalva", JSON.stringify(sacolaProdutos));
        
        return;
    }

    sacolaProdutos.forEach(produto => {
        let precoNumerico = parseFloat(produto.preco.replace("R$", "").replace(".", "").replace(",", "."));
        let subtotalItem = precoNumerico * produto.quantidade;
        valorTotalAcumulado += subtotalItem;

        let divItem = document.createElement('div');
        divItem.style.display = "flex";
        divItem.style.justifyContent = "space-between";
        divItem.style.alignItems = "center";
        divItem.style.marginBottom = "8px";
        
        // Aqui o HTML dos botões de + e - foi integrado corretamente de forma interna
        divItem.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px;">
                <button onclick="diminuirQuantidade('${produto.nome}')">-</button>
                <span><strong>${produto.quantidade}x</strong> ${produto.nome}</span>
                <button onclick="aumentarQuantidade('${produto.nome}')">+</button>
            </div>
            <span>R$ ${subtotalItem.toFixed(2).replace(".", ",")}</span>
        `;
        itensSacolaContainer.appendChild(divItem);
    });

    // Cálculo do total incluindo o Frete
    let totalComFrete = valorTotalAcumulado + FRETE;

    totalSacolaContainer.innerHTML = `
        <p>Subtotal: R$ ${valorTotalAcumulado.toFixed(2).replace(".", ",")}</p>
        <p>Frete: R$ ${FRETE.toFixed(2).replace(".", ",")}</p>
        <h3>Total: R$ ${totalComFrete.toFixed(2).replace(".", ",")}</h3>
    `;
    localStorage.setItem("sacolaSalva", JSON.stringify(sacolaProdutos));
    return;
}

function adicionarNaSacola(produto, ehFavorito) {
    // 1. LINHA CRUCIAL: Antes de adicionar, busca o que já estava na sacola para não apagar o passado
    sacolaProdutos = JSON.parse(localStorage.getItem("sacolaSalva")) || [];

    // 2. Verifica se o produto que você clicou agora já existe nessa lista
    let itemRepetido = sacolaProdutos.find(item => item.nome === produto.nome);

    if (itemRepetido) {
        itemRepetido.quantidade += 1;
    } else {
        sacolaProdutos.push(produto);
    }

    // 3. Exibe o alerta para o usuário
    alert(`"${produto.nome}" foi ${ehFavorito ? 'favoritado e ' : ''}adicionado à sua sacola! Valor: ${produto.preco}`);

    // 4. Desenha a sacola na tela e salva a nova lista unificada no localStorage
    atualizarInterfaceSacola();

    if (menuSacola) {
        menuSacola.classList.add('aberta');
    }
}

// Funções globais para os botões de + e - funcionarem no HTML dinâmico
window.aumentarQuantidade = function(nomeProduto) {
    let produto = sacolaProdutos.find(item => item.nome === nomeProduto);
    if (produto) {
        produto.quantidade += 1;
        atualizarInterfaceSacola();
    }
}

window.diminuirQuantidade = function(nomeProduto) {
    let produto = sacolaProdutos.find(item => item.nome === nomeProduto);
    if (produto) {
        produto.quantidade -= 1;
        // Se a quantidade chegar a zero, remove o item da sacola
        if (produto.quantidade <= 0) {
            sacolaProdutos = sacolaProdutos.filter(item => item.nome !== nomeProduto);
        }
        atualizarInterfaceSacola();
    }
}

function gerenciarCliqueProduto(evento, ehFavorito) {
    // Busca o container do produto (pode ser um <article> ou uma <div class="produto">)
    let containerProduto = evento.target.closest('article') || evento.target.closest('.produto');
    
    if (!containerProduto) {
        console.error("Não foi possível encontrar o container do produto clique.");
        return;
    }

    // Tenta buscar o nome em h1, h2 ou h3 (o que encontrar primeiro)
    let elementoNome = containerProduto.querySelector('h1') || 
                       containerProduto.querySelector('h2') || 
                       containerProduto.querySelector('h3') ||
                       containerProduto.querySelector('.nome-produto'); // se usar classe

    // Tenta buscar o preço em um span, p ou elemento com classe de preço
    let elementoPreco = containerProduto.querySelector('span') || 
                        containerProduto.querySelector('p') ||
                        containerProduto.querySelector('.preco-produto'); // se usar classe

    // Se encontrou ambos, adiciona na sacola
    if (elementoNome && elementoPreco) {
        let informacoesProduto = {
            nome: elementoNome.textContent.trim(),
            preco: elementoPreco.textContent.trim(),
            quantidade: 1
        };
        adicionarNaSacola(informacoesProduto, ehFavorito);
    } else {
        console.warn("Não foi possível ler o nome ou o preço deste produto no HTML.");
    }
}

// Eventos dos botões de comprar/favoritar da vitrine
botoesFavoritos.forEach(botao => {
    botao.addEventListener('click', (evento) => gerenciarCliqueProduto(evento, true));
});

botoesComprar.forEach(botao => {
    botao.addEventListener('click', (evento) => gerenciarCliqueProduto(evento, false));
});

// Controles manuais para abrir e fechar a sacola nos ícones
if (btnAbrirSacola && menuSacola) {
    btnAbrirSacola.addEventListener('click', () => menuSacola.classList.add('aberta'));
}
if (btnFecharSacola && menuSacola) {
    btnFecharSacola.addEventListener('click', () => menuSacola.classList.remove('aberta'));
}

// ==================== FINALIZAR COMPRA ====================
function finalizarCompra() {
    if (sacolaProdutos.length === 0) {
        alert("Sua sacola está vazia!");
        return;
    }

    let subtotal = 0;
    sacolaProdutos.forEach(produto => {
        let preco = parseFloat(produto.preco.replace("R$", "").replace(".", "").replace(",", "."));
        subtotal += preco * produto.quantidade;
    });

    let total = subtotal + FRETE;
    
    // Captura a forma de pagamento se o elemento existir, senão define como 'Não informado'
    let elementoPagamento = document.getElementById("formaPagamento");
    let pagamento = elementoPagamento ? elementoPagamento.value : "Não informada";

    alert(`Pedido realizado com sucesso!\n\nForma de pagamento: ${pagamento}\n\nSubtotal: R$ ${subtotal.toFixed(2).replace(".", ",")}\nFrete: R$ ${FRETE.toFixed(2).replace(".", ",")}\nTotal: R$ ${total.toFixed(2).replace(".", ",")}`);
    
    // Opcional: Limpar a sacola após finalizar
    sacolaProdutos = [];
    atualizarInterfaceSacola();
    if(menuSacola) menuSacola.classList.remove('aberta');
}

if (btnFinalizarCompra) {
    btnFinalizarCompra.addEventListener("click", finalizarCompra);
}

// MOSTRAR NOME NO INDEX
const areaUsuario = document.getElementById("areaUsuario");

if(areaUsuario){

    let usuarioLogado = localStorage.getItem("usuarioLogado");

    if(usuarioLogado){

        areaUsuario.textContent = "Olá, " + usuarioLogado;

    }

}


// SAIR
function sair(){

    localStorage.removeItem("usuarioLogado");

    location.reload();

}

// ==================== CADASTRO ====================
const formCadastro = document.getElementById("formCadastro");

if (formCadastro) {
    formCadastro.addEventListener("submit", function(event) {
        event.preventDefault();

        let nome     = document.getElementById("nome").value;
        let email    = document.getElementById("email").value;
        let senha    = document.getElementById("senha").value;
        let telefone = document.getElementById("telefone").value;
        let bairro   = document.getElementById("bairro").value;
        let rua      = document.getElementById("rua").value;

        let usuario = { nome, email, senha, telefone, bairro, rua };

        localStorage.setItem("usuario", JSON.stringify(usuario));

        alert("Cadastro realizado com sucesso!");

        window.location.href = "login.html";
    });
}


// ==================== LOGIN ====================
const formLogin = document.getElementById("formLogin");

if (formLogin) {
    formLogin.addEventListener("submit", function(event) {
        event.preventDefault();

        let email = document.getElementById("emailLogin").value;
        let senha = document.getElementById("senhaLogin").value;

        let usuario = JSON.parse(localStorage.getItem("usuario"));

        if (usuario && usuario.email === email && usuario.senha === senha) {
            localStorage.setItem("usuarioLogado", usuario.nome);
            alert("Login realizado com sucesso!");
            window.location.href = "index.html";
        } else {
            alert("E-mail ou senha incorretos!");
        }
    });
}

// Seleciona o formulário pelo ID
const formDuvida = document.getElementById('formDuvida');
const emailInput = document.getElementById('emailDuvida');
const textoInput = document.getElementById('textoDuvida');

// Adiciona um evento de escuta para quando o formulário for enviado
formDuvida.addEventListener('submit', function(evento) {
    // Impede o comportamento padrão do formulário (que seria recarregar a página)
    evento.preventDefault();

    // Exibe o alerta de sucesso
    alert("Dúvida enviada com sucesso!");

    // Limpa os campos para o usuário poder digitar outra dúvida se quiser
    emailInput.value = "";
    textoInput.value = "";
});

// Esta linha precisa estar solta no final do script para rodar assim que a página abrir!
atualizarInterfaceSacola();