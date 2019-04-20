var express = require('express'),
    router = express.Router();
const petMongoose = require('../models/pets.js');
const userMongoose = require('../models/user.js');

const util = require('../util/util.js');
const statusCode = util.statusCode;



const favorRoute = router.route('/');
// add favourites

favorRoute.post((req,res)=>{
    let user_id = req.body.user_id;
    let pet_id = req.body.pet_id;

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
});

// delete favorites
favorRoute.delete((req,res)=>{
    let user_id = req.body.user_id;
    let pet_id = req.body.pet_id;

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
});
module.exports = router;




