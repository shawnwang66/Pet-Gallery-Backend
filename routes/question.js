var express = require('express'),
    router = express.Router();
const petMongoose = require('../models/pets.js');
const userMongoose = require('../models/user.js');
const questionMongoose = require('../models/question.js');

const util = require('../util/util.js');
const statusCode = util.statusCode;

const passport = require('passport');

const questionRoute = router.route('/');

/**
 * Create a question under a pet. Update the pet's question array and user's question array accordingly.
 */
questionRoute.post(async (req,res)=>{
    const question = new questionMongoose(req.body);
    const pet = req.body.pet;
    try {
        await passport.authenticate('jwt', {}, (ret) => {
            if (ret !== null) {
                // user is logged in
                let author = ret._id;
                question.save((err,dbRes)=>{
                    if (err)
                        return res.status(statusCode.SERVER_ERR).send({
                            message: "Server error!",
                            data: {}
                        });
                    else{
                        // after saved, update User Schema
                        userMongoose.updateOne(
                          {'_id':author},
                          {'$addToSet':{questionsCreated:dbRes._id}}, (err,userRes)=>{
                              if (err){
                                  return res.status(statusCode.SERVER_ERR).send({
                                      message: "Server error!",
                                      data: {}
                                  });
                              }
                          });

                        petMongoose.updateOne(
                          {'_id':pet},
                          {'$addToSet':{questions:dbRes._id}}, (err,petRes)=>{
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
                });
            } else {
                return res.status(401).send({
                    message: "Unauthorized"
                });
            }
        })(req, res);
    } catch(err) {
        return res.status(500).send({message: err});
    }
});

const questionIDRoute = router.route('/:id');

/**
 * update a question.
 */
questionIDRoute.put((req,res)=>{
    if (req.body.content){
        questionMongoose.updateOne(
            {'_id':req.params.id},
            {$set:{content:req.body.content}},(err,dbRes)=>{
                if (err){
                    return res.status(statusCode.SERVER_ERR).send({
                        message: "Server error!",
                        data: {}
                    });
                }
            }
        )
    }
    if (req.body.upvote){
        questionMongoose.updateOne(
            {'_id':req.params.id},
            {$set:{upvote:req.body.upvote}},(err,dbRes)=>{
                if (err) {
                    return res.status(statusCode.SERVER_ERR).send({
                        message: "Server error!",
                        data: {}
                    });
                }
            }
        )
    }

    questionMongoose.findOne({'_id':req.params.id},(err,dbRes)=>{
        return res.status(statusCode.OK).send({
            message: "OK",
            data: dbRes
        });
    })
});

const questionPetRoute = router.route('/pet/:id');
/**
 * get all questions under a pet
 */
questionPetRoute.get((req,res)=>{
    questionMongoose.find({'pet':req.params.id},(err,dbRes)=>{
        return res.status(statusCode.OK).send({
            message: "OK",
            data: dbRes
        });
    })
});

const questionUserRoute = router.route('/user/:id');
/**
 * get all questions under a user
 */
questionUserRoute.get((req,res)=>{
    questionMongoose.find({'author':req.params.id},(err,dbRes)=>{
        return res.status(statusCode.OK).send({
            message: "OK",
            data: dbRes
        });
    })
});


module.exports = router;
