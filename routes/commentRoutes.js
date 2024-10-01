
const express = require('express');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const router = express.Router();

// Obtener comentarios de un usuario por email
router.get('/user/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const comments = await Comment.find({ email });
    if (!comments.length) return res.status(404).json({ error: 'No se encontraron comentarios' });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un nuevo comentario con email
router.post('/', async (req, res) => {
  const { username, content, email } = req.body;
  const newComment = new Comment({ username, content, email });
  try {
    const savedComment = await newComment.save();
    
    // Crear una notificación
    const notification = new Notification({
      userId: 1,
      message: `Nuevo comentario de ${username}`,
      email,
    });
    await notification.save();

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Editar un comentario
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(id, { content }, { new: true });
    if (!updatedComment) return res.status(404).json({ error: 'Comentario no encontrado' });
    res.json({ message: 'Comentario actualizado', updatedComment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un comentario
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) return res.status(404).json({ error: 'Comentario no encontrado' });
    res.json({ message: 'Comentario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
