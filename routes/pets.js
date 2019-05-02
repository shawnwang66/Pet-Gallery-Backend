var express = require('express'),
    router = express.Router();
const petMongoose = require('../models/pets.js');
const userMongoose = require('../models/user.js');

const util = require('../util/util.js');
const statusCode = util.statusCode;


/**
 * get endpoint to get all the pets, also have a filter and paging
 * right now the category have 0 1 mapping to cat and dog
 * you have to pass in a JSON object for the breed
 * age is a mapping of 0 to 3 to [(Puppy, Kitten), Young, Adult, Senior]
 * price is a mapping of 0 1 2 to [<500USD, 500-2000USD, >2000USD]
 * energy level is 0 to 2
 * reference:
 * https://stackoverflow.com/questions/26814456/how-to-get-all-the-values-that-contains-part-of-a-string-using-mongoose-find
 * https://stackoverflow.com/questions/10811887/how-to-get-all-count-of-mongoose-model
 * we need to set options to i to use it as non case sensitive
 * for where we need to pass in {'input': queryString}
 */
const petRoute = router.route('/');
const categoryMap = ['cat','dog'];
petRoute.get((req, svrRes) => {
    let selectJSON = {};
    let chain = petMongoose.find({}, selectJSON);

    if (req.query.where !== undefined) {
        let where = JSON.parse(req.query.where);
        chain = chain.find(where);
    }

    if (req.query.filter !== undefined) {
        let filter = JSON.parse(req.query.filter).input;
        chain = chain.find({$or: [
                {'name': {$regex: filter, $options: 'i'}},
                {'breed': {$regex: filter, $options: 'i'}},
                {'description': {$regex: filter, $options: 'i'}},
                {'category': {$regex: filter, $options: 'i'}},
            ]});

    }

    if (req.query.type !== undefined) {
        let type = JSON.parse(req.query.type);
        chain = chain.find({"category": categoryMap[type]});
    }

    if (req.query.age !== undefined) {
        let age = JSON.parse(req.query.age);
        chain = chain.find({"age": age});
    }

    if (req.query.breed !== undefined) {
        let breed = JSON.parse(req.query.breed);
        chain = chain.find(breed);
    }

    if (req.query.gender !== undefined) {
        let gender = JSON.parse(req.query.gender);
        chain = chain.find({"gender": gender});
    }

    if (req.query.energyLevel !== undefined) {
        let energyLevel = JSON.parse(req.query.energyLevel);
        const energyLevelMap = ['low', 'medium', 'high'];
        chain = chain.find({"energyLevel": energyLevelMap[energyLevel]});
    }

    if (req.query.price !== undefined) {
        let price = JSON.parse(req.query.price);
        if (price === 0) {
            chain = chain.find({"price": {$gte: 0}});
            chain = chain.find({"price": {$lte: 500}});

        } else if (price === 1) {
            chain = chain.find({"price": {$gte: 500}});
            chain = chain.find({"price": {$lte: 2000}});
        } else if (price === 2) {
            chain = chain.find({"price": {$gte: 2000}});
        }
    }

    chain.countDocuments({}, (err, retCount) => {
        if (err)
            svrRes.status(statusCode.SERVER_ERR).send({
                message: "Server error!",
                data: {}
            })
        else {

            if (req.query.skip !== undefined) {
                chain = chain.skip(JSON.parse(req.query.skip));
            }

            if (req.query.limit !== undefined) {
                chain = chain.limit(JSON.parse(req.query.limit));
            } else {
                chain = chain.limit(100);
            }

            chain.find({}, (err, dbRes) => {
                if (err)
                    svrRes.status(statusCode.SERVER_ERR).send({
                        message: "Server error!",
                        data: {}
                    });
                else
                    svrRes.status(statusCode.OK).send({
                        message: "OK",
                        data: dbRes,
                        count: retCount
                    });
            });
        }
    })
});

petRoute.post((req, svrRes) => {
    const body = new petMongoose(req.body);
    // get user id who create the pet
    // !need to add one field
    let user_id = req.body.user_id;

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
                    if(err){
                        svrRes.status(statusCode.SERVER_ERR).send({
                            message: "Server error!",
                            data: {}
                        });
                    } else {
                        userMongoose.findOne(
                          {'_id':user_id},
                          (err, userRes) => {
                              petMongoose.updateOne(
                                {'_id':dbRes._id},
                                {'location': userRes.location}, (err, finalRes)=> {
                                    if(err) {
                                        svrRes.status(statusCode.SERVER_ERR).send({
                                            message: "Server error!",
                                            data: {}
                                        });
                                    } else {
                                        svrRes.status(statusCode.OK).send({
                                            message: "OK",
                                            data: dbRes
                                        });
                                    }
                                }
                              )
                          }
                        );
                    }
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

petIDRoute.delete((req, svrRes) => {
    const id = req.params.id;
    if (!util.isIdValid(id))
        svrRes.status(statusCode.NOT_FOUND).send({
            message: `${id} is not a valid ID`,
            data: {}
        });
    else {
        petMongoose.deleteOne({'_id': id}, (err, dbRes) => {
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
    }
});





module.exports = router;
