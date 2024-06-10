const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.listen(port,()=>{
    console.log(`Servidor creado en el puero ${port}`);
});

//? Conexion con MYSQL 
const conection =mysql.connect({
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: 3000,
    database: 'mysql',
})