const express = require("express"); 
const mongoose = require("mongoose"); 
require("dotenv").config(); 
const app = express(); 

app.use(express.json()); 

const mongoUri = process.env.MONGODB_URI; 

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
  })
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err);
  });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error de conexión:"));

db.once("open", () => {
  console.log("Conectado a MongoDB");
});

const libroSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
});

const Libro = mongoose.model("Libro", libroSchema);

app.use((req, res, next) => {
  const authToken = req.headers["authorization"];

  if (authToken === "Bearer miTokenSecreto123") {
    next(); 
  } else {
    res.status(401).send("Acceso no autorizado");
  }
});


app.get("/", (req, res) => {
  res.send("Bienvenido a la tienda de libros");
});

//Todos los libros
app.get("/libros", async (req, res) => {
  try {
    const libros = await Libro.find();
    res.json(libros);
  } catch (error) {
    res.status(500).send("Error al obtener libros");
  }
});

//Consultar
app.get("/libros/:id", async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (libro) {
      res.json(libro);
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al buscar el libro");
  }
});

//Crear
app.post("/libros", async (req, res) => {
  const libro = new Libro({
    titulo: req.body.titulo,
    autor: req.body.autor,
  });

  try {
    await libro.save();
    res.json(libro);
  } catch (error) {
    res.status(500).send("Error al guardar libro");
  }
});

//Actualizar
app.put("/libros/:id", async (req, res) => {
  try {
    const libro = await Libro.findByIdAndUpdate(
      req.params.id,
      {
        titulo: req.body.titulo,
        autor: req.body.autor,
      },
      { new: true }
    );

    if (libro) {
      res.json(libro);
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al actualizar el libro");
  }
});

// Eliminar 
app.delete("/libros/:id", async (req, res) => {
  try {
    const libro = await Libro.findByIdAndRemove(req.params.id);
    if (libro) {
      res.status(204).send();
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al eliminar el libro");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor ejecutándose en http://localhost:3000/");
});








