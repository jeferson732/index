
const express = require('express');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const router = express.Router();

// Obtener comentarios de un usuario por email
router.get('/user/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const comments = await Comment.find({ email });
    if (!comments.length ) return res.status(404).json({ error: 'No se encontraron comentarios para este mail' });
    res.json(comments);
  }
   catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un nuevo comentario con email
router.post('/', async (req, res) => {
  const { username, content, email } = req.body;
  
  // Verifica que se proporcionaron todos los datos
  if (!username || !content || !email) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const newComment = new Comment({ username, content, email });
  
  try {
    const savedComment = await newComment.save();
    
    
    
     // Crear una notificación usando el email del comentario
     const notification = new Notification({
      email: email, // Usar el email del comentario
      message: `Nuevo comentario de ${username}`,
    });
    
   // await notification.save();

    res.status(201).json(savedComment);
  } catch (err) {
    console.error('Error al guardar el comentario:', err);
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
