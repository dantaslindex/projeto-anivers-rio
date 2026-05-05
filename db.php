<?php
// ============================================================
// db.php — Conexão com o banco de dados MySQL via PDO
// ============================================================
// ⚠️ SUBSTITUA com seus dados reais antes de fazer upload
// ============================================================

define('DB_HOST', 'localhost');      // geralmente "localhost"
define('DB_NAME', 'aniversario');    // nome do banco que você criar
define('DB_USER', 'root');           // seu usuário MySQL (cPanel: igual ao nome do banco)
define('DB_PASS', ''); // sua senha MySQL

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    // Em produção, nunca mostre a mensagem de erro real ao usuário
    error_log("Erro de conexão: " . $e->getMessage());
    die("Não foi possível conectar ao banco de dados. Tente novamente mais tarde.");
}
