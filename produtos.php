<?php
// Arquivo: produtos.php

// 1. Define o cabeçalho para indicar que o retorno é JSON
header('Content-Type: application/json');

// Inclui o arquivo de conexão
include 'conexao.php';

$produtos_array = [];

// 2. Query para buscar todos os produtos (ordenados do mais novo para o mais antigo)
$sql = "SELECT id, nome, descricao, preco, categoria, imagem_url FROM produtos ORDER BY data_cadastro DESC";
$resultado = $conexao->query($sql);

if ($resultado->num_rows > 0) {
    // 3. Transforma os resultados em um array
    while($linha = $resultado->fetch_assoc()) {
        // Garantimos que o 'preco' seja um float para o JavaScript
        $linha['preco'] = floatval($linha['preco']);
        
        $produtos_array[] = $linha;
    }
}

// 4. Retorna o array de produtos como JSON
echo json_encode($produtos_array);

// 5. Fecha a conexão
$conexao->close();
?>