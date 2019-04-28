var express = require('express'),
    router = express.Router();
const petMongoose = require('../models/pets.js');
const userMongoose = require('../models/user.js');
const passport = require('passport');
const util = require('../util/util.js');
const statusCode = util.statusCode;



const favorRoute = router.route('/');
// add favourites

favorRoute.post(async (req,res)=>{
    let pet_id = req.body.pet_id;
  try {
    await passport.authenticate('jwt', {}, (ret) => {
      if (ret !== null) {
        // user is logged in
        let user_id = ret._id;
        // TODO: validation for errors
        petMongoose.updateOne(
          {'_id':pet_id},
          {'$addToSet':{favoritedBy:user_id}},
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
                data:'Unable to favorite'
              })
            }

            else{
              // update user Schema
              userMongoose.updateOne(
                {'_id':user_id},
                {'$addToSet':{favoritedPets: pet_id}},
                (err,user_res)=>{
                  if (err){
                    res.status(statusCode.SERVER_ERR).send({
                      message: "Server Error!",
                      data:err
                    });
                  }
                  else{
                    res.status(statusCode.OK).send({
                      message: "Favorites Success!"
                    });
                  }
                }
              )
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
favorRoute.delete(async (req,res)=>{
    let user_id = req.body.user_id;
    let pet_id = req.body.pet_id;
  try {
    await passport.authenticate('jwt', {}, (ret) => {
      if (ret !== null) {
        // user is logged in
        let user_id = ret._id;
        // TODO: validation for errors
        petMongoose.updateOne(
          {'_id':pet_id},
          {'$pull':{favoritedBy:{'$in':user_id}}},
          (err,pet_res)=>{
            if (err){
              res.status(statusCode.SERVER_ERR).send({
                message: "Server Error!",
                data:err
              })
            }
            else{
              // update user Schema
              userMongoose.updateOne(
                {'_id':user_id},
                {'$pull':{favoritedPets: {'$in':pet_id}}},
                (err,user_res)=>{
                  if (err){
                    res.status(statusCode.SERVER_ERR).send({
                      message: "Server Error!",
                      data:err
                    });
                  }
                  else{
                    res.status(statusCode.OK).send({
                      message: "Favorites Deleted!"
                    });
                  }
                }
              )
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




