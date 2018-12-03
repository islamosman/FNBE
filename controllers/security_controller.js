const auth_configs = require('../configs/auth-configs');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const HTTPStatus = require('http-status');
const User = require('../models/user');
var nodemailer = require("nodemailer");
const returnHandller = require('../utils/response_Helper');

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "verifymakani@gmail.com",
        pass: "Makani@Zapp2018"
    }
});

module.exports = (app) => {
     // Register
    app.post('/users/register', (req, res, next) => {
        console.log("Called");
        var new_user = new User(req.body);
        new_user.profile.first_name = req.body.first_name;
        new_user.profile.last_name = req.body.last_name;
        new_user.profile.gender = req.body.gender;
        
        new_user.save()
        .then(saved_user => {
            console.log(saved_user);
            var token = jwt.sign({
                id : saved_user._id,
                type : 'user'
            }, auth_configs.jwt_secret);
            // send activation code via Mail  or SMS
            res.setHeader('x-auth-token', token);
            res.status(HTTPStatus.OK).send(saved_user.get_public_fields());
        })
        .catch(err => {
            console.log(err);
            res.status(HTTPStatus.BAD_REQUEST).send(err);
        })
    });

    //Login , passport.authenticate('user-basic'{session : false})
    app.post('/login', (req, res, next) => {       
        User.find({email: req.body.username}).select(User.get_select_all_modifier()).exec()
        .then(user => {
            if(user.length <=0){
                res.status(HTTPStatus.NOT_FOUND).send("Wrong user name or password!");
            }
            else if(!user[0].active)
            {
                res.status(HTTPStatus.FORBIDDEN).send('Verify Code');
            }
            else if(bcrypt.compareSync(req.body.password, user[0].password))
            {
                var token = jwt.sign({
                    id : user._id,
                    type : 'user'
                }, auth_configs.jwt_secret);

                res.setHeader('x-auth-token', token);
                 res.status(HTTPStatus.OK).send({
                    id : user._id,
                    token : token
                });
            }else   {
                res.status(HTTPStatus.NOT_FOUND).send("Wrong user name or password!");
            }
        })
        .catch(err => {
            console.log(err);
            res.status(HTTPStatus.BAD_REQUEST).send(err);
        })
    });
}