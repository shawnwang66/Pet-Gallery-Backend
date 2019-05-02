var mongoose = require('mongoose');

var AnswerSchema = new mongoose.Schema({
    question:{type:String,required:true},
    author : {type : String, required: true},
    upvote : {type : Number, default: 0},
    upvotedBy: [String],
    content : {type : String, required: true},
    dateCreated : {type:Date, default: Date.now}
});

module.exports = mongoose.model('Answer', AnswerSchema);
