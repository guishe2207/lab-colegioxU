const express = require('express');
const path = require('path');
const app = express();
const PUERTO = 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// "Base de datos" en memoria: se reinicia al apagar el servidor
let ideas = [
{ id: 1, autor: 'Profe', texto: '¡Bienvenidos al muro de ideas!', likes: 0 }
];
let siguienteId = 2;
// Listar todas las ideas
app.get('/api/ideas', (req, res) => {
res.json(ideas);
});
// Crear una idea
app.post('/api/ideas', (req, res) => {
const { autor, texto } = req.body;
if (!autor || !texto) {
return res.status(400).json({ error: 'autor y texto son obligatorios' });
}
if (texto.length > 140) {
return res.status(400).json({ error: 'el texto no puede pasar de 140 caracteres' });
}
const nueva = { id: siguienteId++, autor, texto, likes: 0 };
ideas.push(nueva);
res.status(201).json(nueva);
});
// Dar like a una idea
app.put('/api/ideas/:id/like', (req, res) => {
const idea = ideas.find(i => i.id === Number(req.params.id));
if (!idea) {
return res.status(404).json({ error: 'idea no encontrada' });
}
idea.likes++;
res.json(idea);
});
// Eliminar una idea
app.delete('/api/ideas/:id', (req, res) => {
const id = Number(req.params.id);
if (!ideas.some(i => i.id === id)) {
return res.status(404).json({ error: 'idea no encontrada' });
}
ideas = ideas.filter(i => i.id !== id);
res.status(204).send();
});
app.listen(PUERTO, () => {
console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});
