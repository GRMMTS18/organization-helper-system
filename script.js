// Elementos DOM
let products = [];
const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const productForm = document.getElementById("product-form");

// Mapeamento de categorias (Adaptado para "Organization Helper")
const categoryNames = {
  eletronicos: "Eletrônicos",
  livros: "Livros e Documentos",
  roupas: "Vestuário",
  casa: "Casa e Itens Diversos",
};

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
  fetchProductsFromDB().then(() => {
    renderProducts(products);
    setupEventListeners();
  });
});

// Busca produtos do PHP
async function fetchProductsFromDB() {
  try {
    const response = await fetch("produtos.php");
    if (!response.ok) throw new Error("Erro de servidor");
    const data = await response.json();
    products = data;
  } catch (error) {
    console.error("Erro:", error);
    productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; color: #ff4444;">
                <h3>⚠️ Falha na conexão</h3>
                <p>Verifique se o servidor (XAMPP) está ligado.</p>
            </div>
        `;
  }
}

// Configurar Listeners
function setupEventListeners() {
  searchInput.addEventListener("input", filterProducts);
  categoryFilter.addEventListener("change", filterProducts);

  // Validação simples antes de enviar
  productForm.addEventListener("submit", function (e) {
    const preco = document.getElementById("product-price").value;
    if (preco < 0) {
      e.preventDefault();
      alert("O valor não pode ser negativo.");
    }
  });
}

// Renderizar Produtos
function renderProducts(productsToRender) {
  productsGrid.innerHTML = "";

  if (productsToRender.length === 0) {
    productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; color: #888; padding: 2rem;">
                <p>Nenhum item encontrado no inventário.</p>
            </div>
        `;
    return;
  }

  productsToRender.forEach((product, index) => {
    const card = createProductCard(product);
    // Pequeno delay para efeito cascata
    card.style.animationDelay = `${index * 0.1}s`;
    productsGrid.appendChild(card);
  });
}

// Criar HTML do Card (ATUALIZADO PARA NOVO LAYOUT)
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card reveal"; // Adiciona classe de animação

  const priceFormatted = parseFloat(product.preco).toFixed(2).replace(".", ",");

  card.innerHTML = `
        <img src="${product.imagem_url}" alt="${
    product.nome
  }" class="product-image" 
             onerror="this.src='https://images.unsplash.com/photo-1600607686527-6fb886090705?w=400&h=300&fit=crop'">
        
        <div class="card-content">
            <span class="product-category">${
              categoryNames[product.categoria] || product.categoria
            }</span>
            <h3>${product.nome}</h3>
            <p class="product-description">${product.descricao.substring(
              0,
              60
            )}...</p>
            <div class="product-price">R$ ${priceFormatted}</div>
        </div>
    `;

  return card;
}

// Filtros
function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nome.toLowerCase().includes(searchTerm) ||
      product.descricao.toLowerCase().includes(searchTerm);
    const matchesCategory =
      !selectedCategory || product.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  renderProducts(filteredProducts);
}
