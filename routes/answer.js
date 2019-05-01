var express = require('express'),
    router = express.Router();
const petMongoose = require('../models/pets.js');
const userMongoose = require('../models/user.js');
const questionMongoose = require('../models/question.js');
const answerMongoose = require('../models/answer.js');

const util = require('../util/util.js');
const statusCode = util.statusCode;

const answerRoute = router.route('/');



answerRoute.post((req,res)=> {
    const answer = new answerMongoose(req.body);
    const author = req.body.author;
    const question = req.body.question;

    answer.save((err,dbRes)=>{
        if (err)
            return res.status(statusCode.SERVER_ERR).send({
                message: "Server error!",
                data: {}
            });
        else{
            // after saved, update User Schema
            userMongoose.updateOne(
                {'_id':author},
                {'$addToSet':{answersCreated:dbRes._id}}, (err,userRes)=>{
                    if (err){
                        return res.status(statusCode.SERVER_ERR).send({
                            message: "Server error!",
                            data: {}
                        });
                    }
                });

            questionMongoose.updateOne(
                {'_id':question},
                {'$addToSet':{answers:dbRes._id}}, (err,petRes)=>{
                    if (err){
                        return res.status(statusCode.SERVER_ERR).send({
                            message: "Server error!",
                            data: {}
                        });
                    }
                });

            return res.status(statusCode.OK).send({
                message: "OK",
                data: dbRes
            });
        }
    })
});


const answerIDRoute = router.route('/:id');

/**
 * update a question.
 */
answerIDRoute.put((req,res)=>{

});

const answerQuestionRoute = router.route('/question/:id');

answerQuestionRoute.get((req,res)=>{
    answerMongoose.find({'question':req.params.id},(err,dbRes)=>{
        return res.status(statusCode.OK).send({
            message: "OK",
            data: dbRes
        });
    })
});


module.exports = router;
