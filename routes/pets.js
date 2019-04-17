const petMongoose = require('../models/pets.js');
const util = require('../util/util.js');
const statusCode = util.statusCode;

module.exports = (router) => {

    // Process /pet API
    const petRoute = router.route('/pet');
    petRoute.get((req, res) => {
        res.status(statusCode.OK).send({
            message: "OK",
            data: {}
        });
    });

    return router;
}
