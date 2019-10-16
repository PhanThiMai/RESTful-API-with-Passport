
var express = require('express');
var router = express.Router();
const users = require('../models/user.model')
const jwt = require('jsonwebtoken');
const passport = require('passport');

var crypto = require("crypto");

const hashPassword = (email, password) => {
  let secret = `WEBNC${password}`
    .toUpperCase()
    .split("")
    .reverse()
    .join();
  return crypto
    .createHmac("SHA256", secret)
    .update(password)
    .digest("hex");
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({
    msg: "User page"
  })
});



router.post('/register', (req, res, next) => {
  const { body } = req;
  if (!body.email || body.email.length < 6) {
    return res.status(422).json({
      type: 0,
      errors: {
        email: 'Please enter a valid e-mail !',
      },
    });
  }
  if (!body.password || body.password.length < 5) {
    return res.status(422).json({
      type: 0,
      errors: {
        password: 'Your password must be more than 6 characters !',
      },
    });
  }

  users.findOne({
    email: body.email
  })
    .then(user => {
      if (user === null) {
        let finalUser = new users({
          email: body.email,
          password: hashPassword(body.email, body.password)
        });

        return finalUser.save()
          .then(() => res.json({
            data: finalUser,
            type: 1
          }))
          .catch(err => {
            res.json({
              type: 0,
              err: "can not save user"
            })
          });
      } else {
        res.json({ errors: 'User already exists', type: 0 })
      }

    })
    .catch(err => {
      res.json({
        type: 0,
        err: err
      })
    })
});


router.post('/login', function (req, res, next) {

  passport.authenticate('local', { session: false }, (err, user, info) => {

    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Login failed',
        user: user
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign(user, 'WebNC');

      return res.json({ user, token });
    });
  })
    (req, res);

});


router.get('/me', function (req, res, next) {

  passport.authenticate('jwt', { session: false }, (err, user, info) => {

    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Must be logined to access to /me',
        user: user
      });
    }
    return res.json({
      userInfor: user
    }
    )

  })
    (req, res);
});


module.exports = router;
