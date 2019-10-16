const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
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

/* POST login. */
router.post('/login', function (req, res, next) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user: user
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign(user, 'WebNangCao');
            return res.json({ user, token });
        });
    })(req, res);
});


/* POST login. */
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
            if (!user) {
                let finalUser = new user({
                    email: body.email,
                    password: hashPassword(body.email, body.password)
                });

                return finalUser.save()
                    .then(() => res.json({
                        data: finalUser,
                        type: 1
                    }))
                    .catch(err => {
                        res.json({ type: 0 })
                    });
            } else {
                res.json({ errors: 'User already exists', type: 0 })
            }
        })
        .catch(err => {
            res.json({ type: 0 })
        })
});



module.exports = router;