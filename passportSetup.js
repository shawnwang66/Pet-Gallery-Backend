// reference http://www.passportjs.org/packages/passport-local/
// reference http://www.passportjs.org/packages/passport-jwt/

var passport = require('passport'),
    localStrat = require('passport-local'),
    jwtStrat = require('passport-jwt');
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new localStrat.Strategy(
  (username, password, callbackFunction) => {
    try {
      User.find({username: username}, (err, ret) => {
        if (err || ret.length === 0 || ret[0].password !== password) {
          return callbackFunction(false);
        }
        // then we logged in successfully :D
        return callbackFunction(true);
      });
    } catch {
      return callbackFunction(false);
    }
  }
));

const jwtStratSetup = {
  jwtFromRequest: jwtStrat.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'shouldWeHaveADotENVForThisSecret'
};

passport.use(new jwtStrat.Strategy(
  jwtStratSetup,
  (jwtDecoded, callbackFunction) => {
    User.find({username: jwtDecoded.username}, (err, ret) => {
      if (err || ret.length === 0) {
        return callbackFunction(null);
      }
      // then we logged in successfully :D
      return callbackFunction(ret[0]);
    });
  }
));


