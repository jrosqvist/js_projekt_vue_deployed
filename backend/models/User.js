// Inkluderar mongoose och mongoose-scheman
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Databasschema för användare
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// Skapar modell
// När en användare skapas hamnar den i collectionet users och baseras på användar-chemat
const User = mongoose.model("users", UserSchema);

// Exporterar för att kunna användas i andra filer
module.exports = User;