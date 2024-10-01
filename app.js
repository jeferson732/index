const express = require('express');
const app = express ();
const path = require('path');
const PORT = 3001;
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.send('MI PORTAFOLIO');
});
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});












