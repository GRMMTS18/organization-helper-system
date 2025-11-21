// Arquivo: script.js
let products = [];
const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const editModal = document.getElementById("edit-modal");

const categoryNames = {
  eletronicos: "Eletrônicos",
  livros: "Livros e Docs",
  roupas: "Vestuário",
  casa: "Casa e Diversos",
};

document.addEventListener("DOMContentLoaded", function () {
  fetchProductsFromDB();
  setupEventListeners();
});

async function fetchProductsFromDB() {
  try {
    productsGrid.innerHTML =
      '<div style="text-align:center; width:100%; color: #FFD700;">Carregando...</div>';
    const response = await fetch("produtos.php");
    if (response.ok) {
      products = await response.json();
      renderProducts(products);
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}

function setupEventListeners() {
  searchInput.addEventListener("input", filterProducts);
  categoryFilter.addEventListener("change", filterProducts);
  document.getElementById("edit-form").addEventListener("submit", saveEdit);
}

function renderProducts(productsToRender) {
  productsGrid.innerHTML = "";
  if (productsToRender.length === 0) {
    productsGrid.innerHTML = `<div style="color:#888; text-align:center; grid-column: 1/-1;">Nenhum item.</div>`;
    return;
  }
  productsToRender.forEach((product, index) => {
    const card = createProductCard(product);
    card.style.animationDelay = `${index * 0.1}s`;
    productsGrid.appendChild(card);
  });
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card reveal";
  const priceFormatted = parseFloat(product.preco).toFixed(2).replace(".", ",");
  const qtd = product.quantidade ? product.quantidade : 1;
  const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
  const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;

  card.innerHTML = `
        <div class="card-actions">
            <button class="edit-btn" onclick="openEditModal(${
              product.id
            })" title="Editar">${editIcon}</button>
            <button class="delete-btn" onclick="deleteProduct(${
              product.id
            })" title="Excluir">${trashIcon}</button>
        </div>
        <img src="${product.imagem_url}" alt="${
    product.nome
  }" class="product-image" onerror="this.src='https://images.unsplash.com/photo-1600607686527-6fb886090705?w=400&h=300&fit=crop'">
        <div class="card-content">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 5px;">
                <span class="product-category">${
                  categoryNames[product.categoria] || product.categoria
                }</span>
                <span style="font-size: 0.85rem; color: #FFD700; border: 1px solid #FFD700; padding: 2px 8px; border-radius: 10px;">Qtd: ${qtd}</span>
            </div>
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

async function deleteProduct(id) {
  if (confirm("Excluir item?")) {
    try {
      const formData = new FormData();
      formData.append("id", id);
      const response = await fetch("excluir.php", {
        method: "POST",
        body: formData,
      });
      if (response.ok) fetchProductsFromDB();
    } catch (error) {
      console.error(error);
    }
  }
}

function openEditModal(id) {
  const product = products.find((p) => p.id == id);
  if (product) {
    document.getElementById("edit-id").value = product.id;
    document.getElementById("edit-name").value = product.nome;
    document.getElementById("edit-description").value = product.descricao;
    document.getElementById("edit-price").value = product.preco;
    document.getElementById("edit-quantity").value = product.quantidade;
    document.getElementById("edit-category").value = product.categoria;
    document.getElementById("edit-image").value = product.imagem_url;
    editModal.style.display = "flex";
  }
}

function closeEditModal() {
  editModal.style.display = "none";
}

async function saveEdit(e) {
  e.preventDefault();
  try {
    const response = await fetch("editar.php", {
      method: "POST",
      body: new FormData(document.getElementById("edit-form")),
    });
    const data = await response.json();
    if (data.status === "sucesso") {
      closeEditModal();
      fetchProductsFromDB();
      alert("Item atualizado!");
    } else {
      alert("Erro ao atualizar.");
    }
  } catch (error) {
    console.error(error);
  }
}

window.onclick = function (event) {
  if (event.target == editModal) closeEditModal();
};
