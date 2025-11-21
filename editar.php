<?php
// Arquivo: editar.php
include 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Pega o ID e os dados novos
    $id = intval($_POST['edit-id']);
    $nome = $conexao->real_escape_string($_POST['edit-name']);
    $descricao = $conexao->real_escape_string($_POST['edit-description']);
    $preco = floatval($_POST['edit-price']);
    $quantidade = intval($_POST['edit-quantity']);
    $categoria = $conexao->real_escape_string($_POST['edit-category']);
    
    // Se a imagem estiver vazia, mantemos a lógica de url (ou você poderia manter a antiga, mas vamos simplificar)
    $imagem_url = $conexao->real_escape_string($_POST['edit-image']);
    if(empty($imagem_url)) {
        $imagem_url = 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=400&h=300&fit=crop';
    }

    if ($id > 0) {
        // Atualiza os dados no banco
        $sql = "UPDATE produtos SET 
                nome='$nome', 
                descricao='$descricao', 
                preco=$preco, 
                quantidade=$quantidade, 
                categoria='$categoria', 
                imagem_url='$imagem_url' 
                WHERE id=$id";

        if ($conexao->query($sql) === TRUE) {
            echo json_encode(["status" => "sucesso"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "erro", "mensagem" => $conexao->error]);
        }
    } else {
        echo json_encode(["status" => "erro", "mensagem" => "ID inválido"]);
    }
}
$conexao->close();
?>
