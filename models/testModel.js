const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const _ = require('lodash');

const PasswordValidator = require('password-validator');
const Schema = mongoose.Schema;
const UniqueValidator = require('mongoose-unique-validator');


const TestSchema = new Schema({

    param1 : {
        type: String,
        required:true
    },
    
    param2 : {
        type: String,
    },
    param3 : {
        type: String,
    },
    param4 : {
        type: String,
    }
   
});

TestSchema.pre('save', function (next) {
    next();
});


TestSchema.plugin(UniqueValidator);

module.exports = mongoose.model("TestModel", TestSchema);