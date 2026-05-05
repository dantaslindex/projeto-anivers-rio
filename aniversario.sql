-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 05-Maio-2026 às 03:50
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `aniversario`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `acessos`
--

CREATE TABLE `acessos` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(100) NOT NULL,
  `parentesco` enum('pai','mae','outro') NOT NULL,
  `data_acesso` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `acessos`
--

INSERT INTO `acessos` (`id`, `nome`, `parentesco`, `data_acesso`) VALUES
(3, 'Thiago Dantas', 'pai', '2026-05-04 20:58:35'),
(4, 'keila', 'mae', '2026-05-04 22:33:02'),
(5, 'Valquiria', 'outro', '2026-05-04 23:05:16'),
(6, 'Valquiria', 'outro', '2026-05-04 23:06:12'),
(7, 'valquiria', 'outro', '2026-05-04 23:09:44'),
(8, 'valquiria', 'outro', '2026-05-04 23:10:33'),
(9, 'savanna', 'outro', '2026-05-04 23:51:07'),
(10, 'Savanna', 'outro', '2026-05-04 23:54:25'),
(11, 'SAVANNA', 'outro', '2026-05-05 00:26:12'),
(12, 'Jefferson', 'outro', '2026-05-05 01:26:55'),
(13, 'Enilda', 'outro', '2026-05-05 01:32:41'),
(14, 'Enida', 'outro', '2026-05-05 02:13:20'),
(15, 'CAio', 'pai', '2026-05-05 02:16:10'),
(16, 'Nilda', 'outro', '2026-05-05 02:26:05'),
(17, 'savanna', 'outro', '2026-05-05 02:32:57'),
(18, 'Thiago', 'pai', '2026-05-05 02:41:54');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `acessos`
--
ALTER TABLE `acessos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `acessos`
--
ALTER TABLE `acessos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
