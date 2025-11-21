// Arquivo: script.js

// Variáveis Globais
let products = [];
const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const productForm = document.getElementById("product-form");

// Mapeamento de nomes para exibição mais bonita
const categoryNames = {
  eletronicos: "Eletrônicos",
  livros: "Livros e Documentos",
  roupas: "Vestuário",
  casa: "Casa e Decoração",
};

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
  fetchProductsFromDB();
  setupEventListeners();
});

// --- 1. BUSCAR PRODUTOS (READ) ---
async function fetchProductsFromDB() {
  try {
    // Adiciona um loading visual enquanto carrega
    productsGrid.innerHTML =
      '<div style="text-align:center; width:100%; color: #FFD700;">Carregando inventário...</div>';

    const response = await fetch("produtos.php");

    if (response.ok) {
      products = await response.json();
      renderProducts(products);
    } else {
      throw new Error("Erro na resposta do servidor");
    }
  } catch (error) {
    console.error("Erro:", error);
    productsGrid.innerHTML = `<p style="color:#ff4444; text-align:center; grid-column: 1/-1;">Erro ao conectar com o banco de dados.</p>`;
  }
}

// --- 2. CONFIGURAR EVENTOS ---
function setupEventListeners() {
  // Filtros de pesquisa e categoria
  searchInput.addEventListener("input", filterProducts);
  categoryFilter.addEventListener("change", filterProducts);

  // Validação extra no formulário (Opcional, pois o HTML já tem 'required')
  if (productForm) {
    productForm.addEventListener("submit", function (e) {
      const price = document.getElementById("product-price").value;
      if (price < 0) {
        e.preventDefault();
        alert("O valor não pode ser negativo!");
      }
    });
  }
}

// --- 3. RENDERIZAR NA TELA ---
function renderProducts(productsToRender) {
  productsGrid.innerHTML = "";

  if (productsToRender.length === 0) {
    productsGrid.innerHTML = `<div style="color:#888; text-align:center; grid-column: 1/-1; padding: 2rem;">
            <p>Nenhum item encontrado.</p>
        </div>`;
    return;
  }

  productsToRender.forEach((product, index) => {
    const card = createProductCard(product);
    // Adiciona um pequeno atraso na animação para efeito cascata
    card.style.animationDelay = `${index * 0.1}s`;
    productsGrid.appendChild(card);
  });
}

// --- 4. CRIAR O CARD HTML ---
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card reveal";

  // Formata o preço para o padrão brasileiro
  const priceFormatted = parseFloat(product.preco).toFixed(2).replace(".", ",");

  // Ícone SVG de Lixeira
  const trashIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    `;

  card.innerHTML = `
        <button class="delete-btn" onclick="deleteProduct(${
          product.id
        })" title="Excluir Item">
            ${trashIcon}
        </button>

        <img src="${product.imagem_url}" alt="${
    product.nome
  }" class="product-image" 
             onerror="this.src='https://images.unsplash.com/photo-1600607686527-6fb886090705?w=400&h=300&fit=crop'">
        
        <div class="card-content">
            <span class="product-category">${
              categoryNames[product.categoria] || product.categoria
            }</span>
            <h3>${product.nome}</h3>
            <p class="product-description">${
              product.descricao
                ? product.descricao.substring(0, 60) + "..."
                : ""
            }</p>
            <div class="product-price">R$ ${priceFormatted}</div>
        </div>
    `;

  return card;
}

// --- 5. FILTRAGEM ---
function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nome.toLowerCase().includes(searchTerm) ||
      (product.descricao &&
        product.descricao.toLowerCase().includes(searchTerm));
    const matchesCategory =
      !selectedCategory || product.categoria === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  renderProducts(filteredProducts);
}

// --- 6. EXCLUIR PRODUTO (CORRIGIDO COM POST) ---
async function deleteProduct(id) {
  const confirmacao = confirm("Deseja excluir este item permanentemente?");

  if (confirmacao) {
    try {
      // Cria um formulário virtual para enviar o ID via POST
      const formData = new FormData();
      formData.append("id", id);

      const response = await fetch("excluir.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.status === "sucesso") {
        // Recarrega a lista do banco de dados para atualizar a tela
        fetchProductsFromDB();
      } else {
        alert("Erro ao excluir: " + (data.mensagem || "Erro desconhecido"));
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert("Erro ao tentar conectar com o servidor.");
    }
  }
}
