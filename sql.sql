CREATE DATABASE catalogo_db;

CREATE TABLE produtos (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    imagem_url VARCHAR(512),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,,
    quantidade INT NOT NULL DEFAULT 1
);
