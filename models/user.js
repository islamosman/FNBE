const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const _ = require('lodash');

const PasswordValidator = require('password-validator');
const Schema = mongoose.Schema;
const UniqueValidator = require('mongoose-unique-validator');


var validator_schema = new PasswordValidator();
validator_schema
    .is().min(8)
    .is().max(100)
    .has().not().spaces()

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: validate({
            validator: 'isEmail',
            message: 'Invalid Email.'
        })
    },
    device_unique_id : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    phone_number: {
        type: String,
        validate: validate({
            validator: 'isMobilePhone',
            arguments: 'any',
            message: 'Invalid Phone Number.'
        })
    },
    profile: {
        first_name: {
            type: String,
            validate: validate({
                validator: 'matches',
                arguments: /^[a-zA-Z -]+$/,
                message: "First Name should be alphabetic."
            })
        },
        last_name: {
            type: String,
            validate: validate({
                validator: 'matches',
                arguments: /^[a-zA-Z -]+$/,
                message: "Last Name should be alphabetic."
            })
        },
        gender: {
            type: String,
            validate: validate({
                validator: 'matches',
                arguments: /^(male|female|Male|Female)$/,
                message: 'Gender should be male or female.'
            })
        },
        date_of_birth: {
            type: Date,
            validate: (candidate_date) => {
                return candidate_date < Date.now()
            }
        },

    },


    active: {
        type: Boolean,
        default: false
    },

    ver_code: {
        type: String
    },

    profile_picture: {
        type: String,
        default: 'https://res.cloudinary.com/dorw9oxct/image/upload/uploadimages/image-1532428574340'
    },


});

UserSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync(8);
        this.password = bcrypt.hashSync(this.password, salt);
    }
    next();
});

UserSchema.methods.get_public_fields = function () {
    return _.omit(this.toObject(), ['password']);
}

UserSchema.statics.get_select_all_modifier = function () {
    return '+password';
}

// UserSchema.statics.get_select_all_modifier = function(){
//     return; //'+password';
// }

UserSchema.plugin(UniqueValidator);

module.exports = mongoose.model("User", UserSchema);