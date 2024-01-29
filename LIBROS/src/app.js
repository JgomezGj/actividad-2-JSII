const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();


app.use(express.json());

const mongoUri = process.env.MONGODB_URI;

mongoose
.connect(mongoUri)
.then(() => {
    console.log("Conectado a MongoDB");
}).catch((err) => {
    console.error("Error al conectar a MongoDB", err);
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error de conexión"));

db.once("open", () => {
    console.log("Conectado a MongoDB");
});

const libroSchema = new mongoose.Schema({
    titulo: String,
    autor: String
})

const Libro = mongoose.model("Libro", libroSchema);

app.get("/", (req, res) => {
    res.send("Bienvenidos a la app de libros");
});

app.get("/libros", (req, res) => {
    res.json(libros);
});

app.post("/libros", (req, res) => {
    const libro = {
        id : nextId++,
        titulo: req.body.titulo,
        autor: req.body.autor,
    };

    libros.push(libro);
    res.json(libro);
});

app.get("/libros/:id", (req, res) =>{
    const id = parseInt(req.params.id);
    const libro = libros.find((libro) => libro.id === id);
    if (libro) {
        res.json(libro);
    } else {
        res.status(404).send("Libro no encontrado");
    }
});

app.listen(3000, () => {
    console.log("Servidor ejecutandose en http://localhost:3000/");
});