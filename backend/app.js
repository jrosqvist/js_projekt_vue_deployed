// Importerar paket
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Sätter upp express-appen
const app = express();
// Sätter upp på en port (första för Heroku och andra för localhost)
const port = process.env.PORT || 3000;

// Middleware som hanterar JSON-data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Åtkomst
app.use(cors());

// TIllåter åtkomst från samtliga domäner
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
    next();
});

// Hämtar users-filen
const Users = require("./routes/api/users")
// Alla routes till users ska gå via user-filen
app.use("/users", Users);

// Hämta bok-filen
const books = require("./routes/api/books");
// Alla routes till books ska gå via bok-filen
app.use("/api/books", books);

// Statisk katalog
app.use(express.static(__dirname + "/dist/static/"));

// Lyssnar efter requests
app.listen(port, function () {
    console.log(`Lyssnar efter anrop på ${port}`);
});
