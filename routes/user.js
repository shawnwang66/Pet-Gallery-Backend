var express = require('express'),
  router = express.Router();

const userRoute = router.route('/');
const userDebugRoute = router.route('/all/');
const userIDRoute = router.route('/:id');
var mongoose = require('mongoose');
var User = mongoose.model('User');
const passport = require('passport');


userDebugRoute.get(function (req, res) {
  try {
    User.find({}, {'password': 0, 'dateCreated': 0}, (err, ret) => {
      return res.status(200).send({
        message: "Success",
        data: ret
      });
    });
  } catch(err) {
    return res.status(500).send({message: err});
  }
});


userRoute.get(function (req, res) { passport.authenticate('jwt', {}, (retUser) => {
    if (retUser !== null) {
      return res.status(200).send({
        message: "Success",
        data: retUser
      });
    }
    return res.status(401).send({
      message: "Unauthorized"
    });
  })(req, res)
});

userRoute.post(function (req, res) {
  try {
    let newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      location: req.body.location,
      favoritedPets: [],
      petsCreated: [],
      questionsCreated: [],
      answersCreated:[],
      ratings: [],
      imageURL: req.body.imageURL,
      dateCreated: new Date()
    });

    newUser.save((err, ret) => {
      if (err) {
        return res.status(500).send({message: err});
      }
      return res.status(201).send({
        message: "Created",
        data: ret
      });
    });
  } catch(err) {
    return res.status(500).send({message: err});
  }});


userIDRoute.get(function (req, res) {
  try {
    User.find({_id: req.params.id}, {'password': 0, 'dateCreated': 0}, (err, ret) => {
      if (err) {
        return res.status(500).send({message: err});
      }
      if (ret.length === 0) {
        return res.status(404).send({
          message: "Not Found",
          data: ret
        });
      }
      return res.status(200).send({
        message: "Success",
        data: ret
      });
    });
  } catch(err) {
    return res.status(500).send({message: err});
  }
});

userIDRoute.delete(function (req, res) {
  try {
    User.deleteOne({_id: req.params.id},(err, ret) => {
      if (err) {
        return res.status(500).send({message: err});
      }
      return res.status(200).send({
        message: "Success",
        data: ret
      });
    });
  } catch(err) {
    return res.status(500).send({message: err});
  }
});




// This end point is protected by the jwt middle ware
// in order to get your user's info you must log in and the json web token
userRoute.put(async function (req, res) {
  try {
    await passport.authenticate('jwt', {}, (ret) => {
      if (ret !== null) {
        // user is logged in
        User.updateOne(
          {_id: ret._id},
          {
            name: req.body.name!==undefined?req.body.name:ret.name,
            username: ret.username,
            password: req.body.password!==undefined?req.body.password:ret.password,
            email: ret.email,
            location: req.body.location!==undefined?req.body.location:ret.location,
            favoritedPets: req.body.favoritedPets!==undefined?req.body.favoritedPets:ret.favoritedPets,
            petsCreated: req.body.petsCreated!==undefined?req.body.petsCreated:ret.petsCreated,
            questionsCreated: req.body.questionsCreated!==undefined?req.body.questionsCreated:ret.questionsCreated,
            answersCreated:req.body.answersCreated!==undefined?req.body.answersCreated:ret.answersCreated,
            ratings: req.body.ratings!==undefined?req.body.petsCreated:ret.ratings,
            dateCreated: new Date()
          },
          (err, ret) => {
            if (err) {
              return res.status(500).send({message: err});
            }
            return res.status(200).send({
              message: "Success",
              data: ret
            });
          });
      } else {
        return res.status(401).send({
          message: "Unauthorized"
        });
      }
    })(req, res);
  } catch(err) {
    return res.status(500).send({message: err});
  }
});

module.exports = router;


