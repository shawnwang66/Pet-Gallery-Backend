var express = require('express'),
    router = express.Router();
const petMongoose = require('../models/pets.js');
const userMongoose = require('../models/user.js');

const util = require('../util/util.js');
const statusCode = util.statusCode;



// Process /pet API
const petRoute = router.route('/');
petRoute.get((req, svrRes) => {
    // console.log(req.query.where)
    let where = req.query.where === undefined ? {} : JSON.parse(req.query.where);
    petMongoose.find(where, (err, dbRes) => {
        if (err)
            svrRes.status(statusCode.SERVER_ERR).send({
               message: "Server error!",
               data: {}
            });
        else
            svrRes.status(statusCode.OK).send({
                message: "OK",
                data: dbRes
            });
    });
});

petRoute.post((req, svrRes) => {
    const body = new petMongoose(req.body);
    // get user id who create the pet
    // !need to add one field
    let user_id = req.body.user_id;
    console.log(user_id)

    body.save((err, dbRes) => {
        if (err)
            svrRes.status(statusCode.SERVER_ERR).send({
               message: "Server error!",
               data: {}
            });
        else{
            // after saved, update User Schema
            userMongoose.updateOne(
                {'_id':user_id},
                {'$push':{petsCreated:dbRes._id}}, (err,res)=>{
                    if(!err){
                        console.log("OK")
                    }
                });

            svrRes.status(statusCode.OK).send({
                message: "OK",
                data: dbRes
            });


        }

    });


});

const petIDRoute = router.route('/:id');
petIDRoute.get((req, svrRes) => {
    const id = req.params.id;
    if (!util.isIdValid(id))
        svrRes.status(statusCode.NOT_FOUND).send({
            message: `${id} is not a valid ID`,
            data: {}
        });
    else
        petMongoose.find({'_id': id}, (err, dbRes) => {
            if (err)
                svrRes.status(statusCode.SERVER_ERR).send({
                message: "Server error!",
                data: {}
                });
            else if (!dbRes || dbRes.length === 0)
                svrRes.status(statusCode.NOT_FOUND).send({
                    message: `Pet with id ${id} not found`,
                    data: {}
                });
            else
                svrRes.status(statusCode.OK).send({
                    message: "OK",
                    data: dbRes
                });
        });
});

petIDRoute.put((req, svrRes) => {
    const id = req.params.id;
    if (!util.isIdValid(id))
        svrRes.status(statusCode.NOT_FOUND).send({
            message: `${id} is not a valid ID`,
            data: {}
        });
    else
        petMongoose.findOneAndUpdate({'_id': id}, req.body,
                                     {new: true}, (err, dbRes) => {
            if (err)
                svrRes.status(statusCode.SERVER_ERR).send({
                    message: "Server error!",
                    data: {}
                });
            else if (!dbRes || dbRes.length === 0)
                svrRes.status(statusCode.NOT_FOUND).send({
                    message: `Pet with id ${id} not found`,
                    data: {}
                });
            else
                svrRes.status(statusCode.OK).send({
                    message: "OK",
                    data: dbRes
                });
        });
});

module.exports = router;
