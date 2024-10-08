const commentForm = document.getElementById("commentForm");
const commentsContainer = document.getElementById("commentsContainer");
const editButton = document.getElementById("editButton");
let currentEditId = null; // ID del comentario en edición

commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const content = document.getElementById("content").value;
    const email = document.getElementById("email").value;

    try {
        const response = await fetch("/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, content }) 
        });

        const newComment = await response.json();
        displayComment(newComment);
        commentForm.reset();
    } catch (error) {
        console.error("Error:", error);
    }
});

async function fetchComments() {
    try {
        const response = await fetch(`/comments/user/${email.value}`);
        const comments = await response.json();
        comments.forEach(
            (comentario )=>{
                displayComment(comentario)
            }
        );
    } catch (error) {
       // console.error("Error:", error);
    }
}

function displayComment(comment) {
     commentElement = document.createElement("div");
    commentElement.classList.add("comment");
    commentElement.setAttribute("data-id", comment._id);
    commentElement.setAttribute("data-email", comment.email); // Agregar el email aquí

    commentElement.innerHTML = `
        <h3>${comment.username}</h3>
        <p>${comment.content}</p>
        <small>Publicado el: ${new Date(comment.createdAt).toLocaleString()}</small>
        <button onclick="editComment('${comment._id}')">Editar</button>
        <button onclick="deleteComment('${comment._id}')">Eliminar</button>
    `;

    commentsContainer.appendChild(commentElement);
}

function editComment(commentId) {
    const commentToEdit = commentsContainer.querySelector(`[data-id='${commentId}']`);
    document.getElementById("username").value = commentToEdit.querySelector("h3").innerText;
    document.getElementById("content").value = commentToEdit.querySelector("p").innerText;
    document.getElementById("email").value = commentToEdit.getAttribute("data-email"); // Obtener el email del atributo
    currentEditId = commentId;
    editButton.style.display = "inline";
}

editButton.addEventListener("click", async () => {
    const newContent = document.getElementById("content").value;
    try {
        const response = await fetch(`/comments/${currentEditId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: newContent }),
        });
        const updatedComment = await response.json();
        alert("Comentario actualizado con éxito");
        fetchComments(); // Volver a cargar comentarios
    } catch (error) {
        console.error("Error:", error);
    }
});
function deleteComment(commentId) {
    if (confirm("¿Estás seguro de que deseas eliminar este comentario?")) {
        fetch(`/comments/${commentId}`, {
            method: "DELETE",
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al eliminar el comentario');
            }
            return response.json();
        })
        .then(() => {
            alert("Comentario eliminado con éxito");
            // Aquí actualizas la interfaz para eliminar el comentario
            const commentElement = document.querySelector(`[data-id='${commentId}']`);
            if (commentElement) {
                commentElement.remove(); // Eliminar el elemento del DOM
            }
        })
        .catch((error) => console.error("Error:", error));
    }
}


// Inicialmente, carga los comentarios
fetchComments();
