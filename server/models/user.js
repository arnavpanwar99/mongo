const { mongoose } = require('./../db/mongoose');

const { compareSync } = require('bcryptjs');
const { isEmail } = require('validator');
const { sign, verify } = require('jsonwebtoken');
const _ = require('lodash');
const bcryptjs = require('bcryptjs')

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
    },
}

UserSchema.statics = {
    findByToken: async function(token){
        const User = this;
        let decoded;

        try {
            decoded = verify(token, 'abc123');
        } catch (error) {
            return            
        }

        const user = await User.findOne({
            '_id': decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth'
        })
        return user;
    }
}

UserSchema.pre('save', function(next){
    const user = this;

    if(user.isModified('password')){
        const password = user.password;
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(password, salt, (err, hash) => {
                user.password = hash;
                next();            
            })
        })
    }else{
        next();
    }
})

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

const loginUser = async (user, res) => {
    try {
        const { email, password } = user;
        const person = await User.findOne({ email });
        if(!person){
            return res.status(404).send({error: 'user not found'});
        }
        const hashedPassword = person.password;
        const isSame = compareSync(password, hashedPassword);

        if(!isSame){
            return res.status(400).send({error: 'incorrect password'});
        }

        const token = await person.generateAuthToken();
        res.status(200).header('x-auth', token).send({
            email: person.email,
            _id: person._id
        });
    } catch (error) {
        res.status(400).send(error);
    }
}

const removeToken = async(token, user, res) => {
    try {
        await user.updateOne({$pull: {
            tokens: { token }
        }});
        res.status(200).send();
    } catch (error) {
        res.status(400).send();
    }
}

module.exports = {
    User,
    saveUser, 
    loginUser,
    removeToken
}