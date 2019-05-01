var express = require('express'),
  router = express.Router();
const questionMongoose = require('../models/question');
const userMongoose = require('../models/user.js');
const passport = require('passport');
const util = require('../util/util.js');
const statusCode = util.statusCode;



const upvoteQuestionRoute = router.route('/');
// add favourites

upvoteQuestionRoute.post(async (req,res)=>{
  let id = req.body.id;
  try {
    await passport.authenticate('jwt', {}, (ret) => {
      if (ret !== null) {
        // user is logged in
        let user_id = ret._id;
        // TODO: validation for errors
        questionMongoose.updateOne(
          {'_id':id},
          {'$addToSet':{upvotedBy:user_id}},
          (err,pet_res)=>{
            if (err){
              res.status(statusCode.SERVER_ERR).send({
                message: "Server Error!",
                data:err
              })
            }
            if (pet_res.nModified === 0) {
              res.status(statusCode.SERVER_ERR).send({
                message: "Server Error!",
                data:pet_res
              })
            }

            else {
              res.status(statusCode.OK).send({
                message: "Upvote Success!"
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

// delete favorites
upvoteQuestionRoute.delete(async (req,res)=>{
  let user_id = req.body.user_id;
  let id = req.body.id;
  try {
    await passport.authenticate('jwt', {}, (ret) => {
      if (ret !== null) {
        // user is logged in
        let user_id = ret._id;
        // TODO: validation for errors
        questionMongoose.updateOne(
          {'_id':id},
          {'$pull':{upvotedBy:{'$in':user_id}}},
          (err,pet_res)=>{
            if (err){
              res.status(statusCode.SERVER_ERR).send({
                message: "Server Error!",
                data:err
              })
            }
            else{
              res.status(statusCode.OK).send({
                message: "Upvote Deleted!"
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
module.exports = router;




