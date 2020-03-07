const { mongoose } = require('./../db/mongoose');
const { isEmail } = require('validator');
const { sign, verify } = require('jsonwebtoken');

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

        user.tokens.push({ access, token });
        const response = await user.save();
        return response;
    }
}

const User = mongoose.model('User', UserSchema);

const saveUser = async (user, res) => {
    try {
        const newUser = await new User(user);
        const response = await newUser.save();
        const token = await newUser.generateAuthToken();
        res.send(token);
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
    User,
    saveUser
}