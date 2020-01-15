// Express för server
const express = require("express");
// Åtkomst
const cors = require("cors");
// För tokens
const jwt = require("jsonwebtoken");
// För kryptering
const bcrypt = require("bcrypt");
// Mongo
const mongodb = require("mongodb");

// Router
const users = express.Router();
users.use(cors());

// Säkerhetsnyckel
process.env.SECRET_KEY = 'secret';

// Lägg till användare
users.post("/register", async (req, res) => {
    const date = new Date()
    // Läser in inskickad data
    const userData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        created: date
    };
    // Hämtar databas-anslutning
    const users = await loadUsers();
    // Plockar fram användare efter email
    users.findOne({
        email: req.body.email
    })
        .then(user => {
            if (!user) {
                // Krypterar lösenordet
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    userData.password = hash;
                    // Lägger in datat med hashat lösen
                    users.insertOne(userData)
                        .then(user => {
                            res.json({ status: req.body.username + ' registrerad' })
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        });
                });
            } else {
                res.json({ error: 'Användaren finns redan!' });
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        });
})

// Loggar in
users.post('/login', async (req, res) => {
    // Hämtar databasanslutningen
    const users = await loadUsers();
    users.findOne({
        email: req.body.email
    })
        .then(user => {
            if (user) {
                // Jämför lösenorden
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    const payload = {
                        _id: user._id,
                        username: user.username,
                        email: user.email
                    }
                    // Skapar en token giltig i en halvtimme
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: 1800
                    })
                    res.send(token)
                } else {
                    //res.json({ error: 'Användaren finns inte' })
                    res.status(404).send({ error: 'Användaren finns inte' });
                }
            } else {
                //res.json({ error: 'Användaren finns inte' })
                res.status(404).send({ error: 'Användaren finns inte' });
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})


// Ansuter till users-collectionen
async function loadUsers() {
    // Ansluter till molnet där databasen finns lagrad, med användarnamn och lösenord
    const client = await mongodb.MongoClient.connect("mongodb+srv://test:korvpappa22@webbutvecklingmiunjoro1803-f1pft.mongodb.net/test?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true });
    // Skickar tillbaka sökvägen plus rätt databas och collection
    return client.db("books").collection("users");
}

module.exports = users;

