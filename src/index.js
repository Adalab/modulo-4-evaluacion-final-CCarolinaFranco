// Servidor Express
// Imports

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require('dotenv').config()

// Arracar el servidor

const server = express();

// Configuración del servidor

server.use(cors());
server.use(express.json({ limit: "25mb" }));


// Conexion a la base de datos

async function getConnection() {
  const connection = await mysql.createConnection(
    {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS,
      database: process.env.DB_NAME || "recetas_db",
    }
  );

  connection.connect();
  return connection;
}

// Poner a escuchar el servidor

const port = process.env.PORT || 4500;
server.listen(port, () => {
  console.log(`Ya se ha arrancado nuestro servidor: http://localhost:${port}/`);
});



// Endpoints

// GET todas las recetas
server.get("/recetas", async (req, res) => {
  try {
    const conn = await getConnection();
    const [results] = await conn.query("SELECT * FROM recetas");
    conn.end();

    res.json({
      info: {
        count: results.length,
      },
      results,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error no se encotraron las recetas",
    });
  }
});



// GET una receta para obtener una receta
server.get('/recetas/:id', async (req, res) => {
  const id = req.params.id;
  const select = "SELECT * FROM recetas WHERE id = ?";
  const conn = await getConnection()
  const [result] = await conn.query(select, id);

  console.log(result); //usar el postman aqui 
  conn.end();
  res.json({

    info: {
      count: result.length,
    },
    results: result,


  });

});



//POST para anadir receta
server.post('/recetas', async (req, res,) => {
  
  const newRecipe = req.body;
  try {
    const insert = "INSERT INTO  recetas (nombre, ingredientes, instrucciones) value (?,?,?) "
    const conn = await getConnection()
    const [result] = await conn.query(insert, [
     
      newRecipe.nombre,
      newRecipe.ingredientes,
      newRecipe.instrucciones,

    ]);


    conn.end();
    res.json({

      success: true,
    })
  } catch (error) {
    res.json({
      success: false,
      message: error
    })
  }
})



//PUT: modificar el algun dato q ya existe en la base de datos 
server.put("/recetas/:id/:recipe_id", async (req, res) => {
  const id = req.params.id;
  const recipe_id = req.params.recipe_id;
  const { nombre, ingredientes, instrucciones } = req.body;
  try {
    const update = "UPDATE recetas SET nombre = ?, ingredientes = ?, instrucciones = ? WHERE id = ?";
    const conn = await getConnection() 
    const [result] = await conn.query(update, [
      nombre,
      ingredientes,
      instrucciones,
      recipe_id,
    ])

    conn.end();
    res.json({
      success: true,
    });

  }
  catch (error) {
    res.json({
      success: false,  
      message: error

    })
  }
})






///DELETE para borrar un dato de la base de datos/

server.delete('/recetas/:id', async (req, res) => {
  const id = req.params;
  try {
    const deletesql = "DELETE FROM recetas WHERE id=?" 
    const conn = await getConnection()
    const [result] = await conn.query(deletesql, [id])
    conn.end();
    res.json({
      success: true,});
  }
  catch (error) {
    res.json({
      success: false,  
      message: error

    })
  }
})








