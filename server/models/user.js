const { mongoose } = require('./../db/mongoose');

const { isEmail } = require('validator');
const { sign, verify } = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        }
    }]
});

UserSchema.methods = {
    generateAuthToken: async function(){
        const user = this;
        const access = 'auth';
        const signObject = {
            access,
            _id: user._id.toHexString()
        }
        const token = sign(signObject, 'abc123').toString();

        await user.tokens.push({ access, token });
        await user.save();
        return token;
    },

    toJSON: function(){
        const user = this;
        const userObject = user.toObject();
        return _.pick(userObject, ['_id', 'email']);
    }
}

const User = mongoose.model('User', UserSchema);

const saveUser = async (user, res) => {
    try {
        const newUser = new User(user);
        const response = await newUser.save();
        const token = await newUser.generateAuthToken();
        res.header('x-auth', token).send(response);
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
    User,
    saveUser
}