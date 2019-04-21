/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router));
    app.use('/api/user', require('./user.js'));
    app.use('/api/login', require('./login.js'));

};
