// reference: https://medium.com/front-end-weekly/learn-using-jwt-with-passport-authentication-9761539c4314
// https://medium.com/devgorilla/how-to-log-out-when-using-jwt-a8c7823e8a6
// https://stackoverflow.com/questions/18690354/passport-local-strategy-not-getting-called
var express = require('express'),
  router = express.Router();
const loginRoute = router.route('/');
const passport = require('passport');
const jsonWebToken = require('jsonwebtoken');

loginRoute.post(function (req, res) {
  passport.authenticate('local', {}, loginStatus => {
    // if loginStatus is true, then we have successfully logged in
    // if false or null, then the log in is unsuccessful
    if (loginStatus) {
      const genToken = jsonWebToken.sign({username: req.body.username}, 'shouldWeHaveADotENVForThisSecret');
      return res.status(200).send({message: 'login success', token: genToken});
    }
    return res.status(401).send({message: 'unauthorized'});
  })(req, res);
});

module.exports = router;
