const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor creado en http://localhost:${PORT}`);
});

const conection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "20ADs34lL./",
    port: 3306,
    database: "Mensajeria"
});

conection.connect((err) => {
    if (err) {
        console.error(err.message || "No se pudo conectar a la base de datos");
    } else {
        console.log('Conectado a la base de Datos');
    }
});

app.post('/register', async (req, res) => {
    const { Nombre, Password } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    conection.query(`INSERT INTO users (Nombre, Password) VALUES ("${Nombre}", "${hashedPassword}")`, (e, result) => {
        if (e) {
            res.status(500).json('message: ', e.message || "No se pudo conectar a la base de datos");
        } else {
            res.status(200).json(result);
        }
    });
});

app.post('/login', (req, res) => {
    const { Nombre, Password } = req.body;
    conection.query(`SELECT * FROM users WHERE Nombre="${Nombre}"`, async (e, results) => {
        if (e) {
            res.status(500).json('message: ', e.message || "No se pudo conectar a la base de datos");
        } else {
            if (results.length > 0) {
                const user = results[0];
                const match = await bcrypt.compare(Password, user.Password);
                if (match) {
                    res.status(200).json(user);
                } else {
                    res.status(401).json({ message: "Nombre o contraseña incorrectos" });
                }
            } else {
                res.status(401).json({ message: "Nombre o contraseña incorrectos" });
            }
        }
    });
});

app.post('/message', (req, res) => {
    const { senderID, receiverID, message } = req.body;
    conection.query(`INSERT INTO messages (senderID, receiverID, message) VALUES (${senderID}, ${receiverID}, "${message}")`, (e, result) => {
        if (e) {
            res.status(500).json('message: ', e.message || "No se pudo conectar a la base de datos");
        } else {
            res.status(200).json(result);
        }
    });
});

app.get('/messages', (req, res) => {
    const { senderID, receiverID } = req.query;
    conection.query(`SELECT * FROM messages WHERE (senderID=${senderID} AND receiverID=${receiverID}) OR (senderID=${receiverID} AND receiverID=${senderID}) ORDER BY timestamp`, (e, results) => {
        if (e) {
            res.status(500).json('message: ', e.message || "No se pudo conectar a la base de datos");
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/users', (req, res) => {
     conection.query('SELECT ID, Nombre FROM users', (e, results) => {
         if (e) {
             res.status(500).json('message: ', e.message || "No se pudo conectar a la base de datos");
         } else {
             res.status(200).json(results);
         }
     });
 });
 