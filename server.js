// ============================================================
// server.js — Servidor Node.js com Express + MySQL2
// ============================================================

const express  = require('express');
const mysql    = require('mysql2/promise');
const session  = require('express-session');
const path     = require('path');
const fs       = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// ⚠️  CONFIGURE AQUI antes de rodar
// ============================================================
const DB_CONFIG = {
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASS     || '',
  database: process.env.DB_NAME     || 'aniversario',
  port:     Number(process.env.DB_PORT) || 3306,
  charset:  'utf8mb4',
};
const SESSION_SECRET = 'dantas-18-anos-secret-key';

// ============================================================
// ⚠️  NOMES PERMITIDOS POR PARENTESCO
// ============================================================

// Só estes nomes podem entrar como "pai"
const NOMES_PAI = ['thiago', 'tiago'];

// Só este nome pode entrar como "mãe"
const NOMES_MAE = ['keila'];

// Nomes permitidos como "outro" → mapeados para a sua página
const NOMES_ESPECIAIS = {
  'igor':     'pagina-igor',
  'savanna':  'pagina-savanna',
  'valquiria': 'pagina-Lila',
  'lila':     'pagina-Lila',
  'jefferson': 'pagina-Gege',
  'gege':     'pagina-Gege',
  'nilda':    'pagina-Nilda',
  'enilda':   'pagina-Nilda',
};
// ============================================================

// ── MIDDLEWARES ──────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(express.static(path.join(__dirname)));

// ── CONEXÃO COM MYSQL ────────────────────────────────────────
let db;
(async () => {
  try {
    db = await mysql.createPool(DB_CONFIG);
    console.log('✅ Conectado ao MySQL');
    await db.query(`
      CREATE TABLE IF NOT EXISTS acessos (
        id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nome        VARCHAR(100) NOT NULL,
        parentesco  ENUM('pai','mae','outro') NOT NULL,
        data_acesso DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Tabela "acessos" pronta');
  } catch (err) {
    console.error('❌ Erro ao conectar ao MySQL:', err.message);
    console.error('Verifique as credenciais em DB_CONFIG no server.js');
  }
})();

// ── HELPER: normaliza nome (remove acentos, minúsculas, trim) ─
function normalizar(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// ── HELPER: injeta meta tag com o nome na página ─────────────
function servirPagina(arquivo, req, res) {
  const filePath = path.join(__dirname, arquivo);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Página não encontrada: ' + arquivo);
  }
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace('<head>', `<head><meta name="usuario-nome" content="${req.session.nome || ''}">`);
  res.send(html);
}

// ── ROTAS ────────────────────────────────────────────────────

app.get('/', (req, res) => res.redirect('/login'));

// GET /login
app.get('/login', (req, res) => {
  if (req.session.nome) {
    return res.redirect('/' + (req.session.destino || 'pagina-mae'));
  }
  res.sendFile(path.join(__dirname, 'login.html'));
});

// POST /login — validação completa
app.post('/login', async (req, res) => {
  const nome       = (req.body.nome || '').trim();
  const parentesco = req.body.parentesco || '';

  if (!nome) return res.redirect('/login?erro=nome');
  if (!['pai', 'mae', 'outro'].includes(parentesco)) return res.redirect('/login?erro=parentesco');

  const nomeNorm = normalizar(nome);
  let destino;

  if (parentesco === 'pai') {
    if (!NOMES_PAI.includes(nomeNorm)) {
      console.log(`⛔ Acesso negado: "${nome}" tentou entrar como pai`);
      return res.redirect('/pagina-erro?nome=' + encodeURIComponent(nome));
    }
    destino = 'pagina-pai';

  } else if (parentesco === 'mae') {
    if (!NOMES_MAE.includes(nomeNorm)) {
      console.log(`⛔ Acesso negado: "${nome}" tentou entrar como mãe`);
      return res.redirect('/pagina-erro?nome=' + encodeURIComponent(nome));
    }
    destino = 'pagina-mae';

  } else {
    // "outro" — verifica NOMES_ESPECIAIS
    destino = NOMES_ESPECIAIS[nomeNorm];
    if (!destino) {
      console.log(`⛔ Acesso negado: "${nome}" não está na lista de convidados`);
      return res.redirect('/pagina-erro?nome=' + encodeURIComponent(nome));
    }
    console.log(`🔀 "${nome}" (outro) → /${destino}`);
  }

  // Registra no banco
  try {
    await db.query(
      'INSERT INTO acessos (nome, parentesco, data_acesso) VALUES (?, ?, NOW())',
      [nome, parentesco]
    );
  } catch (err) {
    console.error('Erro ao inserir no banco:', err.message);
  }

  req.session.nome       = nome;
  req.session.parentesco = parentesco;
  req.session.destino    = destino;

  res.redirect('/' + destino);
});

// ── PÁGINAS PROTEGIDAS ───────────────────────────────────────

app.get('/pagina-pai',     requireLogin, (req, res) => servirPagina('pagina-pai.html',     req, res));
app.get('/pagina-mae',     requireLogin, (req, res) => servirPagina('pagina-mae.html',     req, res));
app.get('/pagina-igor',    requireLogin, (req, res) => servirPagina('pagina-igor.html',    req, res));
app.get('/pagina-savanna', requireLogin, (req, res) => servirPagina('pagina-savanna.html', req, res));
app.get('/pagina-Lila',    requireLogin, (req, res) => servirPagina('pagina-Lila.html',    req, res));
app.get('/pagina-Gege',    requireLogin, (req, res) => servirPagina('pagina-Gege.html',    req, res));
app.get('/pagina-Nilda',   requireLogin, (req, res) => servirPagina('pagina-Nilda.html',   req, res));

// ── RESUMOS ──────────────────────────────────────────────────
app.get('/resumo',     requireLogin, (req, res) => res.sendFile(path.join(__dirname, 'resumo.html')));
app.get('/resumo-pai', requireLogin, (req, res) => res.sendFile(path.join(__dirname, 'resumo-pai.html')));

// ── PÁGINA DE ERRO ───────────────────────────────────────────
app.get('/pagina-erro', (req, res) => res.sendFile(path.join(__dirname, 'pagina-erro.html')));

// ── LOGOUT ───────────────────────────────────────────────────
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// ── ADMIN ────────────────────────────────────────────────────
app.get('/admin/acessos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM acessos ORDER BY data_acesso DESC');
    res.json({ total: rows.length, acessos: rows });
  } catch (err) {
    res.status(500).json({ erro: 'Banco de dados indisponível' });
  }
});

// ── MIDDLEWARE DE AUTENTICAÇÃO ───────────────────────────────
function requireLogin(req, res, next) {
  if (req.session.nome) return next();
  res.redirect('/login');
}

// ── INICIA O SERVIDOR ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`   Página de login:  http://localhost:${PORT}/login`);
  console.log(`   Ver acessos:      http://localhost:${PORT}/admin/acessos\n`);
});