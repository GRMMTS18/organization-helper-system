<?php
// Arquivo: conexao.php

// Configurações do Banco de Dados XAMPP (Padrão)
$servidor = "localhost";
$usuario = "root"; // Usuário padrão do XAMPP
$senha = "";       // Senha padrão do XAMPP (vazio)
$banco_de_dados = "catalogo_db"; // NOME DO BD NO PHPMYADMIN

// Criar a conexão
$conexao = new mysqli($servidor, $usuario, $senha, $banco_de_dados);

// Verificar a conexão
if ($conexao->connect_error) {
    // Para a execução e mostra o erro em caso de falha
    die("Falha na conexão com o Banco de Dados: " . $conexao->connect_error);
}

// Definir o charset para UTF8
$conexao->set_charset("utf8");

// Este arquivo será incluído em todos os scripts PHP que acessam o BD
?>