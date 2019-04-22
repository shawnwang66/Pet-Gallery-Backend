// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    location: {type: String, default: 'unknown location'},
    favoritedPets: [String],
    petsCreated: [String],
    role: {type: String, default: 'user'},
    questionsCreated: [String],
    answersCreated:[String],
    imageURL: {type: String, default: 'default image'},
    ratings: [Number],
    dateCreated: Date
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
