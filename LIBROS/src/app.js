const express = require("express");
const app = express();

app.use(express.json());

const libros = [
    {id: 1, titulo: "Sin limites", autor: "Jim Kwik"},
    {id: 2, titulo: "Cien años de soledad", autor: "Gabriel Garcia Marquez"},
    {id: 3, titulo: "Pensar rapido pensar despacio", autor: "Daniel Kahneman"}
];

let nextId = 4;

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