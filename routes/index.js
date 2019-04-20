/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router));
    app.use('/api/pets', require('./pets.js'));
    app.use('/api/favorite', require('./favorite.js'));
    app.use('/api/image', require('./image.js'));
    app.use('/api/question',require('./question.js'));
};
