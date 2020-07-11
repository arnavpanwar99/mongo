const { ObjectID } = require('mongodb');
const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const { sign, verify } = require('jsonwebtoken');

const _id = new ObjectID();

const userId = new ObjectID();

const userIdTwo = new ObjectID();

const userIdThree = new ObjectID();

const todos = [{
    text: 'first',
    completed: false,
    _id,
    _creator: userId
} ,{    
    text: 'second',
    completed: true,
    _id: new ObjectID(),
    _creator: userIdTwo
}]

const users = [{
    _id: userId,
    email: 'arnav@fee.cim',
    password: '123456abc!',
    tokens: [{
        access:'auth',
        token: sign({ _id: userId, access: 'auth' }, 'abc123').toString()
    }]
}, {
    _id: userIdTwo,
    email: 'ram@dds.csdc',
    password: 'ramshyam'
}]


const populateTodos = (done) => {
    Todo.deleteMany({}).then(() => {
        Todo.insertMany(todos)
        return done();
    })
    
}

const populateUsers = (done) => {
    User.deleteMany({}).then(async() => {
        await new User(users[0]).save();
        await new User(users[1]).save();
        done();
    }) 
}

module.exports = {
    todos,
    populateTodos,
    _id,
    populateUsers,
    users
}