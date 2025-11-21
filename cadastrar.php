<?php
// Arquivo: cadastrar.php

// Inclui a conexão
include 'conexao.php';

// Verifica se veio do formulário
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Recebe os dados
    $nome = $conexao->real_escape_string($_POST['product-name']);
    $descricao = $conexao->real_escape_string($_POST['product-description']);
    $preco = floatval($_POST['product-price']); 
    $categoria = $conexao->real_escape_string($_POST['product-category']);
    
    // Define imagem
    $imagem_url = empty($_POST['product-image']) 
        ? 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop' 
        : $conexao->real_escape_string($_POST['product-image']);

    // SQL para inserir
    $sql = "INSERT INTO produtos (nome, descricao, preco, categoria, imagem_url) 
            VALUES ('$nome', '$descricao', $preco, '$categoria', '$imagem_url')";

    // Executa
    if ($conexao->query($sql) === TRUE) {
        header("Location: index.html#products");
        exit();
    } else {
        echo "Erro: " . $conexao->error;
    }
    $conexao->close();
} else {
    header("Location: index.html");
    exit();
}
?>