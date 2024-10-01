const express = require('express');
const router = express.Router();

// Ruta básica de notificaciones
router.get('/', (req, res) => {
  res.json({ message: 'Lista de notificaciones' });
});

module.exports = router;
