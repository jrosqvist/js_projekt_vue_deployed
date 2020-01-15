// Inkluderar mongoose
const mongoose = require("mongoose");
// Skapar variabel för att kunna använda mongoose-scheman
const Schema = mongoose.Schema;

// Deklarerar ett nytt schema för kurser
let bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        default: "Ej angivet"
    },
    author: {
        type: String,
        default: "Ej angivet"
    },
    published: {
        type: Number,
        default: 0
    },
    pages: {
        type: Number,
        default: 0
    },
    user: {
        type: String,
        ref: "user"
    }
});

// Skapar modell
// När en bok skapas hamnar den i collectionet bok och baseras på bok-Schemat
const Book = mongoose.model("books", bookSchema);

// Exporterar för att kunna användas i andra filer
module.exports = Book;

