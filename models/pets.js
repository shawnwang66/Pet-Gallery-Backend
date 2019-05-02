// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var PetSchema = new mongoose.Schema({
    name: { type: String, required: true },
	category: { type: String, required: true },
	breed: { type: String, default: 'unknown' },
	age: { type: Number, default: 2 },
	gender: { type: String, default: 'unknown' },
	owner: { type: String, required: true },
	questions: [ String ],
	location: String,
	favoritedBy: [ String ],
	imageURLs: [ String ],
	frontImageRatio: { type: Number },
	size: {
        type: String,
        enum: [ 'small', 'medium', 'large' ]
    },
	energyLevel: {
        type: String,
        enum: [ 'low', 'medium', 'high' ]
    },
	description: { type: String, default: 'No descriptions' },
	price: { type: Number, default: 0 },
	dateCreated: { type: Date, default: Date.now }
});

// Export the Mongoose model
module.exports = mongoose.model('Pet', PetSchema);
