const express = require('express');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const router = express.Router();


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


router.post('/', async (req, res) => {
  const { username, content, email } = req.body;
  const newComment = new Comment({ username, content, email });
  try {
    const savedComment = await newComment.save();
    
    
    const notification = new Notification({
      userId: /* Aquí el ID del propietario de la publicación */,
      message: `Nuevo comentario de ${username}`,
      email,
    });
    await notification.save();

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


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
