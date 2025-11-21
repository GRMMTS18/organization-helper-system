<?php
// Arquivo: excluir.php
include 'conexao.php';

// Verifica se a requisição é do tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Pega o ID enviado pelo JavaScript
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;

    if ($id > 0) {
        $sql = "DELETE FROM produtos WHERE id = $id";

        if ($conexao->query($sql) === TRUE) {
            echo json_encode(["status" => "sucesso"]);
        } else {
            // Erro no SQL
            http_response_code(500);
            echo json_encode(["status" => "erro", "mensagem" => $conexao->error]);
        }
    } else {
        // ID inválido
        http_response_code(400);
        echo json_encode(["status" => "erro", "mensagem" => "ID inválido ou não fornecido"]);
    }
} else {
    // Método errado
    http_response_code(405);
    echo json_encode(["status" => "erro", "mensagem" => "Método não permitido"]);
}

$conexao->close();
?>
