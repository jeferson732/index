const commentForm = document.getElementById('commentForm');
const commentsContainer = document.getElementById('commentsContainer');

commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const content = document.getElementById('content').value;
    const email = document.getElementById('email').value;

    try {
        const response = await fetch('/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, content, email })
        });

        const newComment = await response.json();
        displayComment(newComment);

        commentForm.reset();
    } catch (error) {
        console.error('Error:', error);
    }
});


async function fetchComments(email) {
    try {
        const response = await fetch(`/comments/user/${email}`);
        const comments = await response.json();
        comments.forEach(displayComment);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayComment(comment) {
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.innerHTML = `
        <h3>${comment.username}</h3>
        <p>${comment.content}</p>
        <small>Publicado el: ${new Date(comment.createdAt).toLocaleString()}</small>
    `;
    commentsContainer.appendChild(commentElement);
}


fetchComments('email@example.com'); 


const notificationSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    message: String,
    email: String,
    isRead: { type: Boolean, default: false },
  }, { timestamps: true });
  
  const Notification = mongoose.model('Notification', notificationSchema);
  // Agregar una notificación cuando se cree un comentario
  app.post('/comments', async (req, res) => {
    const { username, content, email } = req.body;
  
    const newComment = new Comment({ username, content, email });
  
    try {
      const savedComment = await newComment.save();
  
      // Crear notificación para el propietario de la publicación
      const notification = new Notification({
        userId: /* Aquí va el ID del propietario de la publicación */,
        message: `Nuevo comentario en tu publicación por ${username}`,
        postId,
      });
      
      await notification.save();
  
      res.status(201).json(savedComment);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  // Obtener notificaciones para un usuario
  app.get('/notifications/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
  
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  