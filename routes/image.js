var express = require('express'),
    router = express.Router();
const petMongoose = require('../models/pets.js');
const userMongoose = require('../models/user.js');

const util = require('../util/util.js');
const statusCode = util.statusCode;

const imageRoute = router.route('/');

// update image in Pet Schema
imageRoute.post((req,res)=>{
    let url = req.body.url;
    let pet_id = req.body.pet_id;
    if (!pet_id){
        res.status(statusCode.NOT_FOUND).send({
            message:"Pet Id not valid",
            data:[]
        })
    }
    else{
        petMongoose.updateOne(
            {'_id':pet_id},
            {'$addToSet':{imageURLs:url}},
            (err,pet_res)=>{
                if (err){
                    res.status(statusCode.SERVER_ERR).send({
                        message:"Server Error",
                        data:[]
                    });
                }
                else{
                    res.status(statusCode.OK).send({
                        message:"Image url added",
                        data: url
                    })
                }
            });
    }

    });

// delete image in Pet Schema
imageRoute.delete((req,res)=>{
    let url = req.body.url;
    let pet_id = req.body.pet_id;
    if (!pet_id){
        res.status(statusCode.NOT_FOUND).send({
            message:"Pet Id not valid",
            data:[]
        })
    }
    else{
        petMongoose.updateOne(
            {'_id':pet_id},
            {'$pull':{imageURLs:{'$in':url}}},
            (err,pet_res)=>{
                if (err){
                    res.status(statusCode.SERVER_ERR).send({
                        message:"Server Error",
                        data:[]
                    });
                }
                else{
                    res.status(statusCode.OK).send({
                        message:"Image url deleted",
                        data: []
                    })
                }
            });
    }

});

module.exports = router;
