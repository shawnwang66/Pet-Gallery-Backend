var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
    pet:{type:String,required:true},
    answers : [String],
    upvotedBy: [String],
    author : {type : String, required: true},
    upvote : {type : Number, default: 0},
    content : {type : String, required: true},
    dateCreated : {type:Date, default: Date.now}
});

module.exports = mongoose.model('Question', QuestionSchema);
