// Express för server
const express = require("express");
// Bodyparser för JSON-hantering
const bodyParser = require("body-parser");
// Åtkomster
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

// Hanterar utvecklingen
if (process.env.NODE_ENV === "production") {
    // Statisk katalog
    app.use(express.static(path.join(__dirname, "/dist/static/")));
    // HAntera singe page applikationen
    // .* refererar till alla routes
    app.get(/.*/, (req, res) => {
        // Skickar till startsidan
        res.sendFile(__dirname + "/dist/index.html")
    });
}

// Lyssnar för request till port 3000
app.listen(port, function () {
    console.log(`Lyssnar efter anrop på ${port}`);
});
