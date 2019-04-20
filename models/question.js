var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
    answers : [_id],
    author : {type : _id, required: true},
    upvote : {type : Number, default: 0},
    content : {type : String, required: true},
    dateCreated : {type:Date, default: Date.now}
});

module.exports = mongoose.model('Question', QuestionSchema);
