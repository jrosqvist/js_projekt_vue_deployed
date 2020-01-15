// Express för server
const express = require("express");
// Mongodb
const mongodb = require("mongodb");
// Sätt upp routern
const router = express.Router();
// Inkluderar modellen för kurser
const Book = require("../../models/Book");

// Gör webbtjänsten tillgänlig från samtliga domäner
router.all('/*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
    next();
});


// Hämtar alla böcker
router.get('/', async (req, res) => {
    const books = await loadBooksCollection();
    // Hittar och returnerar böckerna i en array
    books.find(async (err) => {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            res.send(await books.find().toArray());
        }
    });
});

// Hämtar bok från specifik användare
router.get('/user/', async (req, res) => {
    // Plockar fram användaren och sparar i variabel
    let getUser = req.query.name;
    // Hämtar anslutningsvägen
    const books = await loadBooksCollection();
    books.find({ user: getUser }, async (err) => {
        if (err) {
           res.send(err);
           console.log(err);
        } else {
            res.send(await books.find({ "user": getUser }).toArray());
        }
    });
})


// Hämtar en bok
router.get('/:id', async (req, res) => {
    // Plockar fram id:t och sparar i variabel
    let getId = new mongodb.ObjectID(req.params.id);
    // Hämtar anslutningsvägen
    const books = await loadBooksCollection();
    books.find({ _id: getId }, async (err) => {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            res.send(await books.find({ _id: getId }).toArray());
        }
    });
})

// Lägg till böcker
router.post("/", async (req, res) => {
    // Skapar ett nytt bok-objekt med inskickad data
    let newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        published: req.body.published,
        pages: req.body.pages,
        user: req.body.user
    });
    // Hämtar anslutningen
    const books = await loadBooksCollection();
    // Lägger till i databasen
    books.insertOne(newBook, (err) => {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            // Skickar respons om vilket objekt som lagts till
            res.status(201).send({ message: "Tillagd" });
        }
    });
});

// Ta bort bok
router.delete("/:id", async (req, res) => {
    // Hämtar anslutningen
    const books = await loadBooksCollection();
    // Angivet id
    let deleteId = new mongodb.ObjectID(req.params.id);
    // Tar bort posten
    books.deleteOne({ _id: deleteId }, (err) => {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            // Skickar respons om vilket objekt som raderats
            res.status(200).send({ message: "Raderad" });
        }
    });
});

// Uppdatera bok
router.put("/:id", async (req, res) => {
    // Nya id:t och datat
    let updateId = new mongodb.ObjectID(req.params.id);
    let updateBook = {
        title: req.body.title,
        author: req.body.author,
        published: req.body.published,
        pages: req.body.pages
    };
    // Hämtar anslutningen
    const books = await loadBooksCollection();
    // Uppdaterar efter id:t och skickar med det nya objektet
    books.updateOne({ _id: updateId }, { $set: updateBook }, (err) => {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            // Skickar respons om vilket objekt som uppdaterats
            res.status(200).send({ message: "Uppdaterad" });
        }
    });

})

// Ansuter till books-collectionen
async function loadBooksCollection() {
    // Ansluter till molnet där databasen finns lagrad, med användarnamn och lösenord
    const client = await mongodb.MongoClient.connect("mongodb+srv://test:korvpappa22@webbutvecklingmiunjoro1803-f1pft.mongodb.net/test?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true });
    // Skickar tillbaka sökvägen plus rätt databas och collection
    return client.db("books").collection("books");
}

// Exporterar routern
module.exports = router;