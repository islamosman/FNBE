const BasicStrategy = require('passport-http').BasicStrategy;
const bcrypt = require('bcrypt-nodejs');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport');

const auth_configs = require('./configs/auth-configs');
const User = require('./models/user');



module.exports = () => {

    passport.use('jwt-user-only', new JwtStrategy({
        secretOrKey : auth_configs.jwt_secret,
        jwtFromRequest : ExtractJwt.fromHeader('x-auth-token')
    }, (jwt_payload, done) => {
            if(jwt_payload.type == 'user'){
                User.findOne({
                    _id : jwt_payload.id
                })
                .select(User.get_select_all_modifier()).exec()
                .then(user => {
                    return done(null, user);
                })
                .catch(err => {
                    return done(err);
                })
            }
            else{
                return done(null, false);
            }
        }
    ));

    passport.use('jwt-admin-only', new JwtStrategy({
        secretOrKey : auth_configs.jwt_secret,
        jwtFromRequest : ExtractJwt.fromHeader('x-auth-token')
    }, (jwt_payload, done) => {
            if(jwt_payload.type == 'admin'){
                Admin.findOne({
                    _id : jwt_payload.id
                })
                .select(Admin.get_select_all_modifier()).exec()
                .then(admin => {
                    return done(null, admin);
                })
                .catch(err => {
                    return done(err);
                })
            }
            else{
                return done(null, false);
            }
        }
    ));

   
    passport.use('user-basic', new BasicStrategy(
        
        (username, password, done) => {
            console.log('s'); 
                User.findOne({
                email : username
            }).select(User.get_select_all_modifier()).exec()
            .then(user => {
                console.log('s'); 
                if (!user){
                    console.log('s');        return done(null, false);
                }
                else if (bcrypt.compareSync(password, user.password)){
                    console.log('s');return done(null, user);
                }
                else{
                    console.log('s');return done(null, false);
                }
            })
            .catch(err => {console.log('s');
                return done(err);
            });
        }
    ));

    passport.use('admin-basic', new BasicStrategy(
        (email, password, done) => {
            Admin.findOne({
                email : email
            }).select(Admin.get_select_all_modifier()).exec()
            .then(admin => {
                if (!admin){
                    return done(null, false);
                    
                }
                else if (bcrypt.compareSync(password, admin.password)){
                    return done(null, admin);
                }
                else{
                    return done(null, false);
                }
            })
            .catch(err => {
                return done(err);
            });
        }
    ));

}