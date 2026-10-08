const lista = document.getElementById('lista');
const mensaje = document.getElementById('mensaje');
const form = document.getElementById('form-idea');
// Dibuja una idea en pantalla.
// Usamos textContent (y no innerHTML) para que nadie pueda inyectar código en el muro.
function crearTarjeta(idea) {
const tarjeta = document.createElement('div');
tarjeta.className = 'idea';
const autor = document.createElement('p');
autor.className = 'autor';
autor.textContent = idea.autor;
const texto = document.createElement('p');
texto.className = 'texto';
texto.textContent = idea.texto;
const acciones = document.createElement('div');
acciones.className = 'acciones';
const btnLike = document.createElement('button');
btnLike.className = 'like';
btnLike.textContent = '★ ' + idea.likes;
btnLike.addEventListener('click', () => darLike(idea.id));
const btnBorrar = document.createElement('button');
btnBorrar.className = 'borrar';
btnBorrar.textContent = 'Borrar';
btnBorrar.addEventListener('click', () => borrar(idea.id));
acciones.append(btnLike, btnBorrar);
tarjeta.append(autor, texto, acciones);
return tarjeta;
}

// READ: pedir todas las ideas al backend
async function cargarIdeas() {
const respuesta = await fetch('/api/ideas');
const ideas = await respuesta.json();
lista.innerHTML = '';
ideas.forEach(idea => lista.appendChild(crearTarjeta(idea)));
}
// CREATE: enviar una idea nueva
form.addEventListener('submit', async (evento) => {
evento.preventDefault();
mensaje.textContent = '';
const respuesta = await fetch('/api/ideas', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
autor: document.getElementById('autor').value,
texto: document.getElementById('texto').value
})
});
if (!respuesta.ok) {
const error = await respuesta.json();
mensaje.textContent = error.error;
return;
}
document.getElementById('texto').value = '';
cargarIdeas();
})
// UPDATE: dar like
async function darLike(id) {
await fetch('/api/ideas/' + id + '/like', { method: 'PUT' });
cargarIdeas();
}
// DELETE: borrar una idea
async function borrar(id) {
await fetch('/api/ideas/' + id, { method: 'DELETE' });
cargarIdeas();
}
cargarIdeas();
