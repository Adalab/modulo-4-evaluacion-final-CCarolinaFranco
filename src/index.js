// Servidor Express

// Para probar los ficheros estáticos del fronend, entrar en <http://localhost:4500/>
// Para probar el API, entrar en <http://localhost:4500/api/items>

// Imports

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require('dotenv').config()



// Arracar el servidor

const server = express();

// Configuración del servidor

server.use(cors());
server.use(express.json({limit: "25mb"}));




// Conexion a la base de datos

async function getConnection() {
  const connection = await mysql.createConnection(
    {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS,  // <-- Pon aquí tu contraseña o en el fichero /.env en la carpeta raíz
      database: process.env.DB_NAME || "Clase",
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

// GET /api/items 

// endpoint para obtener los gatos
server.get('/api/kittens/:user', async (req , res) =>{
 const user = req.params.user;
 const select = "SELECT * FROM kitten where owner = ?"; ///para sacar datos de la tabla de la  base de datos adakitten
 const conn = await getConnection() // como es una async connection need to use await llamando a la funcion q conecta con la base de datos 
 const [result] = await conn.query(select, user ); //en result se guarda la ejecucion del select con el query, el await se usa por q es una coneccion asyncrona
 // el await o espera es de la coneccion q se hizo acon la base de datos  que esta en la cosntante 'conn', conn.query ejecuta la sentencia q se guardo en 'select' esta sentencia tiene una parte variable
 // que 'user' como segundo parametro
console.log(result); //usar el postman aqui 
conn.end();
 res.json({//aqui se devuelve uan respuesta de formato json // usar el postman aqui 
  
    info: {
        count: result.length , //número de elementos del listado o cantidad gatos por eso se usa length para saber la cantidad de gatos
    },
    results: result, //listado de gatitos


 });

});

//endpoint para anadir gatos, dentro de esta funcion se recibe informacion por el parametro  body:recibo toda la info del gato y por
//el parametro url params: se recibe el user

server.post('/api/kittens/:user', async (req , res, )=>{
const user = req.params.user;//el parametro url params: se recibe en el user IMPORTANTE es req!! aqui 
const newkitten = req.body; //body:recibo toda la info del gato

///el try and catch sirve para cuando queremos hacer el insert cuando hay algun error. sirve para q no se rompa la
// ejecucion de la web, nos avisa si hay algun error en la ejecuacion del insert entonces no va a dar el respuesta false
///en el try se mete el insert 

try{
  const insert = "INSERT INTO  kitten (owner, url, name, race, `desc`) value (?,?,?,?,?) " // enviando datos a la base de datos 
  const conn= await getConnection() //conectando de nuevo con la base de dato atraves de la funcion
  const [result] = await conn.query(insert, [
    user, 
    newkitten.url, 
    newkitten.name, 
    newkitten.race, 
    newkitten.desc,
  
  
  ]);// se guarda los resultado en result y se ejecuta el query de la sentencia de la base de datos 'insert'
  //es decir se ejecuta lo q se envia atraves de lso parametros(owner,url,name etc)
  conn.end();
  res.json({//check in postman with post/body/row/json/ con el objeto{} con lo datos q voy a enviar como prueba
    
      success: true ,// true: para q nos diga q si se insertaron los datos en la base de datos
  
  })
} catch (error)
{
res.json({//check in postman with post/body/row/json/ con el objeto{} con lo datos q voy a enviar como prueba
    
  success: false,// false: este mensaje es para que nos diga que no se inserto nada en la base de datos hay un error en el insert
  message:error // esto nos va a dar la especificidad del error donde esta el error

})

}

})

///endpoint para modificar el algun dato q ya existe en la base de datos 
server.put("/api/kittens/:user/:kitten_id", async(req, res) =>{
const user = req.params.user;
//const kittenId = req.params.kitten_Id;
const kittenId = req.params.kitten_id; 
const {url, name, race, desc} = req.body;
try{
  const update = "UPDATE kitten SET url= ?, name= ?, race= ? 'desc'= ? WHERE id= ?" // update de los campos y hayq especificar el where sino cambian todos los datos 
  const conn= await getConnection() //me conecto a la base de datos 
  const [result] = await conn.query(update,[
    url, 
    name, 
    race, 
    desc, 
    kittenId ])//datos del front que contiene estos valores

  conn.end();
  res.json({///no olvidearse de la respuesta!
    success: true,
  });

}
catch (error){
  res.json({
    success: false,  //este mensaje es para que nos diga que no se inserto nada en la base de datos hay un error en el put/modificar
    message:error

  })
}
})

///endpoint para borrar un dato de la base de datos/ tengo q saber el id del gato a eliminar

server.delete('/api/kittens/:user/:kitten_id', async(req, res) =>{
  const {user,kitten_id} = req.params;

try{

  const deletesql = "DELETE FROM kitten WHERE id = ? and owner = ?" // los q se quiere borrar
  const conn = await getConnection() 
  const [result] = await conn.query(deletesql,[kitten_id,user])//se ejecuta el delete o sentencia sql
  conn.end();
  res.json({///no olvidearse de la respuesta!
    success: true,
  });
}
catch(error){
  res.json({
    success: false,  //este mensaje es para que nos diga que no se inserto nada en la base de datos hay un error en el put/modificar
    message:error

  })



}
})








