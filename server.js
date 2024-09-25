
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Comment = require('./models/Comment');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión:', err))

app.post('/comments', async (req, res) => {
  const { username, content, postId } = req.body;
  const comment = new Comment({ username, content, postId });
  try {
    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/comments/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ postId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/comments/:id', async (req, res) => {
  const { id } = req.params;
  const { username, content } = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(id, { username, content }, { new: true });
    if (!updatedComment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    res.json(updatedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    res.json({ message: 'Comentario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
