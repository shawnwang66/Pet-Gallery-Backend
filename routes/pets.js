const petMongoose = require('../models/pets.js');
const util = require('../util/util.js');
const statusCode = util.statusCode;

module.exports = (router) => {

    // Process /pet API
    const petRoute = router.route('/pet');
    petRoute.get((req, svrRes) => {
        petMongoose.find({}, (err, dbRes) => {
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
        body.save((err, dbRes) => {
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

    const petIDRoute = router.route('/pet/:id');
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
    return router;
}
