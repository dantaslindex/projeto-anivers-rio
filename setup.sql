-- ============================================================
-- setup.sql — Execute este arquivo UMA VEZ para criar o banco
-- ============================================================
-- Como executar:
--   No phpMyAdmin: Cole no campo SQL e clique em "Executar"
--   No terminal:   mysql -u root -p < setup.sql
-- ============================================================

-- 1. Criar o banco de dados (se ainda não existir)
CREATE DATABASE IF NOT EXISTS aniversario
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE aniversario;

-- 2. Tabela de acessos (registra quem acessou o site e quando)
CREATE TABLE IF NOT EXISTS acessos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(100)  NOT NULL,
  parentesco  ENUM('pai', 'mae', 'outro') NOT NULL,
  data_acesso DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Consultas úteis para você verificar depois:
-- ============================================================

-- Ver todos os acessos:
-- SELECT * FROM acessos ORDER BY data_acesso DESC;

-- Ver só os pais:
-- SELECT * FROM acessos WHERE parentesco = 'pai';

-- Ver quantas vezes cada pessoa acessou:
-- SELECT nome, COUNT(*) as total FROM acessos GROUP BY nome ORDER BY total DESC;
