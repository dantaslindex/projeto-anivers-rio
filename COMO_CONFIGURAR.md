# 📦 Guia Completo de Configuração

## Estrutura dos arquivos

```
projeto/
├── login.php          ← Página de login (entrada)
├── db.php             ← Conexão com MySQL
├── setup.sql          ← Cria o banco de dados
├── pagina-pai.html    ← Landing page versão Pai (verde)
├── pagina-mae.html    ← Landing page versão Mãe/Outro (rosa/roxo)
└── COMO_CONFIGURAR.md ← Este guia
```

---

## PARTE 1 — Configurar o EmailJS (envio de email)

O EmailJS permite enviar emails diretamente do HTML, sem servidor.

### Passo a passo:

**1. Criar conta**
- Acesse [emailjs.com](https://www.emailjs.com) e crie uma conta gratuita
- O plano gratuito permite 200 emails/mês, que é mais que suficiente

**2. Criar um Email Service**
- No painel, vá em **Email Services → Add New Service**
- Escolha **Gmail** (ou outro que preferir)
- Autorize a conta do Gmail onde você quer receber os emails
- Anote o **Service ID** gerado (ex: `service_abc123`)

**3. Criar um Email Template**
- Vá em **Email Templates → Create New Template**
- Configure assim:

```
Assunto:  🎁 Nova escolha de presente - {{versao}}

Corpo:
Olá!

Alguém escolheu presente no seu site de aniversário!

Versão acessada: {{versao}}

Opções escolhidas:
{{message}}

Data: {{reply_to}}
```

- Clique em **Save** e anote o **Template ID** (ex: `template_xyz456`)

**4. Pegar sua Public Key**
- Vá em **Account → General**
- Copie a **Public Key** (ex: `user_AbCdEfGhIj`)

**5. Preencher nos arquivos HTML**

Abra `pagina-pai.html` e `pagina-mae.html` e substitua no início do `<script>`:

```javascript
emailjs.init("SUA_PUBLIC_KEY_AQUI");  // ← sua Public Key

const EMAILJS_SERVICE_ID  = "SEU_SERVICE_ID";    // ← ex: service_abc123
const EMAILJS_TEMPLATE_ID = "SEU_TEMPLATE_ID";   // ← ex: template_xyz456
const MEU_EMAIL           = "seuemail@gmail.com"; // ← seu email
```

---

## PARTE 2 — Configurar o banco de dados MySQL

### Se você usa cPanel (hospedagem compartilhada):

**1. Criar o banco de dados**
- No cPanel, vá em **MySQL Databases**
- Em "Create New Database", coloque o nome: `aniversario`
- Clique em **Create Database**

**2. Criar um usuário MySQL**
- Na mesma página, em "MySQL Users", crie um usuário
- Exemplo: nome `aniv_user`, crie uma senha forte
- Em "Add User To Database", vincule o usuário ao banco `aniversario`
- Marque **ALL PRIVILEGES** e salve

**3. Criar a tabela**
- Vá em **phpMyAdmin** no cPanel
- Selecione o banco `aniversario` na barra lateral
- Clique na aba **SQL**
- Cole o conteúdo do arquivo `setup.sql` e clique em **Executar**

**4. Preencher db.php**

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'seunome_aniversario'); // ← no cPanel o nome fica "usuario_banco"
define('DB_USER', 'seunome_aniv_user');   // ← igual ao criado no cPanel
define('DB_PASS', 'sua_senha_forte');
```

> ⚠️ No cPanel, o nome do banco e do usuário geralmente ficam com prefixo do seu usuário de hospedagem. Ex: se seu usuário é `joao123`, o banco fica `joao123_aniversario`.

### Se você usa XAMPP (local):

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'aniversario');
define('DB_USER', 'root');
define('DB_PASS', '');  // XAMPP não tem senha por padrão
```

Execute o `setup.sql` no phpMyAdmin do XAMPP.

---

## PARTE 3 — Upload dos arquivos

### Ordem de upload:

1. Faça upload de **todos os arquivos** para a pasta `public_html` do seu servidor (ou subpasta)
2. Certifique-se de incluir suas **fotos** (IMG_0589.jpg, FOTOLATERAL.jpg)
3. Acesse `seusite.com/login.php` para testar

### Fluxo do sistema:

```
login.php
   ↓ (preenche nome + seleciona parentesco)
   ├── parentesco = "pai"          → pagina-pai.html  (tema verde)
   └── parentesco = "mae" / "outro" → pagina-mae.html (tema rosa/roxo)
```

O login registra o acesso no banco de dados. Para ver quem acessou, abra o phpMyAdmin e rode:

```sql
SELECT * FROM acessos ORDER BY data_acesso DESC;
```

---

## PARTE 4 — Personalizar os textos

### Nas landing pages (pagina-pai.html / pagina-mae.html):

| O que mudar | Onde encontrar |
|---|---|
| Textos da seção info | `<ul class="info-lines">` |
| Subtítulo do hero | `<p class="hero-sub">` |
| Nome das opções | `data-label="..."` nos inputs |
| Ícones das opções | `<span class="option-icon">` |
| Fotos | Troque os arquivos `.jpg` |

---

## Resumo rápido dos arquivos que precisa editar:

| Arquivo | O que preencher |
|---|---|
| `db.php` | DB_HOST, DB_NAME, DB_USER, DB_PASS |
| `pagina-pai.html` | Public Key, Service ID, Template ID, seu email |
| `pagina-mae.html` | Public Key, Service ID, Template ID, seu email |
| `setup.sql` | Executar no phpMyAdmin (só uma vez) |
