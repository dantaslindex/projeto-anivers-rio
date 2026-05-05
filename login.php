<?php
// ============================================================
// login.php — Página de login com redirecionamento por parentesco
// ============================================================

session_start();

// Se já estiver logado, redireciona direto
if (isset($_SESSION['nome'])) {
    $destino = ($_SESSION['parentesco'] === 'pai') ? 'pagina-pai.html' : 'pagina-mae.html';
    header("Location: $destino");
    exit;
}

require_once 'db.php';   // Conexão com o banco de dados
$erro = '';

// ── PROCESSAR FORMULÁRIO ──
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome       = trim($_POST['nome'] ?? '');
    $parentesco = $_POST['parentesco'] ?? '';

    // Validação
    if (empty($nome)) {
        $erro = 'Por favor, insira seu nome.';
    } elseif (!in_array($parentesco, ['pai', 'mae', 'outro'])) {
        $erro = 'Selecione um parentesco válido.';
    } else {
        // Registra o acesso no banco
        $stmt = $pdo->prepare("INSERT INTO acessos (nome, parentesco, data_acesso) VALUES (?, ?, NOW())");
        $stmt->execute([$nome, $parentesco]);

        // Salva na sessão
        $_SESSION['nome']       = $nome;
        $_SESSION['parentesco'] = $parentesco;

        // Redireciona: pai → pagina-pai.html | mãe/outro → pagina-mae.html
        $destino = ($parentesco === 'pai') ? 'pagina-pai.html' : 'pagina-mae.html';
        header("Location: $destino");
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dantas · Entrar</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --dark: #0b1520;
    --green: #76a713;
    --cream: #f8f5ef;
    --white: #ffffff;
    --gray: #6b7280;
    --border: rgba(11,21,32,0.12);
    --error: #dc2626;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  /* BG decorativo */
  body::before {
    content: '18';
    position: fixed;
    font-family: 'Playfair Display', serif;
    font-size: 60vw;
    font-weight: 900;
    color: rgba(11,21,32,0.03);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    user-select: none;
    z-index: 0;
  }

  .login-card {
    background: var(--white);
    border-radius: 24px;
    padding: 56px 48px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 24px 80px rgba(11,21,32,0.1);
    position: relative;
    z-index: 1;
  }

  .card-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 40px;
  }
  .logo-mark {
    width: 40px; height: 40px;
    background: var(--dark);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .logo-name {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--dark);
  }

  .card-title {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 8px;
    line-height: 1.15;
  }
  .card-sub {
    font-size: 14px;
    color: var(--gray);
    font-weight: 300;
    margin-bottom: 36px;
    line-height: 1.6;
  }

  .form-group {
    margin-bottom: 20px;
  }
  label.field-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--dark);
    margin-bottom: 8px;
  }
  input[type="text"] {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: var(--dark);
    background: var(--cream);
    transition: border-color 0.2s, background 0.2s;
    outline: none;
  }
  input[type="text"]:focus {
    border-color: var(--green);
    background: white;
  }
  input[type="text"].input-error {
    border-color: var(--error);
    background: #fef2f2;
  }

  /* Selecão de parentesco — cards visuais */
  .parentesco-options {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
  }
  .parentesco-options input[type="radio"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  .parentesco-options label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 16px 8px;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    cursor: pointer;
    background: var(--cream);
    transition: all 0.2s ease;
    font-size: 13px;
    font-weight: 500;
    color: var(--gray);
    text-align: center;
  }
  .parentesco-options label:hover {
    border-color: var(--green);
    color: var(--dark);
  }
  .parentesco-options input[type="radio"]:checked + label {
    border-color: var(--green);
    background: #f7fced;
    color: var(--dark);
    box-shadow: 0 4px 12px rgba(118,167,19,0.15);
  }
  .parentesco-options label .opt-icon {
    font-size: 24px;
  }

  /* Erro */
  .error-box {
    background: #fef2f2;
    border: 1px solid #fca5a5;
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 14px;
    color: var(--error);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Botão */
  .btn-submit {
    width: 100%;
    padding: 15px;
    background: var(--dark);
    color: white;
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 28px;
    transition: background 0.2s, transform 0.15s;
    letter-spacing: 0.3px;
  }
  .btn-submit:hover { background: #1e3a50; transform: translateY(-1px); }
  .btn-submit:active { transform: translateY(0); }

  .footer-note {
    text-align: center;
    font-size: 12px;
    color: #b0b0b0;
    margin-top: 28px;
  }

  @media (max-width: 480px) {
    .login-card { padding: 40px 28px; }
  }
</style>
</head>
<body>

<div class="login-card">

  <div class="card-logo">
    <div class="logo-mark">💚</div>
    <span class="logo-name">Dantas</span>
  </div>

  <h1 class="card-title">Olá, quem é você?</h1>
  <p class="card-sub">Insira seu nome e selecione seu parentesco para continuar.</p>

  <?php if ($erro): ?>
  <div class="error-box">
    <span>⚠️</span> <?= htmlspecialchars($erro) ?>
  </div>
  <?php endif; ?>

  <form method="POST" action="login.php" id="login-form">

    <div class="form-group">
      <label class="field-label" for="nome">Seu nome</label>
      <input
        type="text"
        id="nome"
        name="nome"
        placeholder="Ex: João Silva"
        value="<?= htmlspecialchars($_POST['nome'] ?? '') ?>"
        autocomplete="off"
        class="<?= $erro && empty($_POST['nome']) ? 'input-error' : '' ?>"
      >
    </div>

    <div class="form-group">
      <label class="field-label">Você é</label>
      <div class="parentesco-options">

        <span>
          <input type="radio" name="parentesco" id="opt-pai" value="pai"
            <?= ($_POST['parentesco'] ?? '') === 'pai' ? 'checked' : '' ?>>
          <label for="opt-pai">
            <span class="opt-icon">👨</span>
            Pai
          </label>
        </span>

        <span>
          <input type="radio" name="parentesco" id="opt-mae" value="mae"
            <?= ($_POST['parentesco'] ?? '') === 'mae' ? 'checked' : '' ?>>
          <label for="opt-mae">
            <span class="opt-icon">👩</span>
            Mãe
          </label>
        </span>

        <span>
          <input type="radio" name="parentesco" id="opt-outro" value="outro"
            <?= ($_POST['parentesco'] ?? '') === 'outro' ? 'checked' : '' ?>>
          <label for="opt-outro">
            <span class="opt-icon">🫂</span>
            Outro
          </label>
        </span>

      </div>
    </div>

    <button type="submit" class="btn-submit">Entrar →</button>

  </form>

  <p class="footer-note">© 2024 Dantas · Feito com 💚</p>
</div>

<script>
// Validação client-side antes de submeter
document.getElementById('login-form').addEventListener('submit', function(e) {
  const nome = document.getElementById('nome').value.trim();
  const parentesco = document.querySelector('input[name="parentesco"]:checked');

  if (!nome) {
    e.preventDefault();
    document.getElementById('nome').classList.add('input-error');
    document.getElementById('nome').focus();
    return;
  }
  if (!parentesco) {
    e.preventDefault();
    alert('Por favor, selecione seu parentesco.');
  }
});
document.getElementById('nome').addEventListener('input', function() {
  this.classList.remove('input-error');
});
</script>
</body>
</html>
