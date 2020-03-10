const { User } = require('./../models/user');

const authenticate = async (req, res, next) => {
    const token = req.header('x-auth');

    const user = await User.findByToken(token);
    
    if(!user){
        return res.status(401).send();
    }

    req.user = user;
    req.token = token;
    next();
};

module.exports = {
    authenticate
}