
var express = require('express');
var router = express.Router();
const users = require('../models/user.model')

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



module.exports = router;
