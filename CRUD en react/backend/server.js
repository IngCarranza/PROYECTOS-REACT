// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Para recibir datos en formato JSON

// Configura la conexión a la base de datos PostgreSQL
const pool = new Pool({
    user: 'postgres',           // Tu usuario de PostgreSQL
    host: 'localhost',          // O la IP de tu servidor de base de datos
    database: 'misistema',      // Nombre de tu base de datos
    password: '123',   // Tu contraseña de PostgreSQL
    port: 5432,                 // Puerto de PostgreSQL
});

// Ruta para obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener usuarios');
    }
});

// Ruta para agregar un nuevo usuario
app.post('/usuarios', async (req, res) => {
    const { nombre, apellido, edad, correo } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, apellido, edad, correo) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, apellido, edad, correo]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar usuario');
    }
});

// Ruta para actualizar un usuario
app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, edad, correo } = req.body;
    try {
        const result = await pool.query(
            'UPDATE usuarios SET nombre = $1, apellido = $2, edad = $3, correo = $4 WHERE id = $5 RETURNING *',
            [nombre, apellido, edad, correo, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar usuario');
    }
});

// Ruta para eliminar un usuario
app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar usuario');
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
