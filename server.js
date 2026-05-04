const express = require('express');
const path = require('path');
const app = express();

// Isso diz ao Node para usar a pasta atual onde o server.js está
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    // Tenta enviar o arquivo index.html da pasta public
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});