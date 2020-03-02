const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// const _id = '5e5cbf0008591917a58219d4';

// if(!ObjectID.isValid(_id)){
//     console.log('id not valid')
// }

// Todo.findOne({ _id }).then((todos) => {
//     console.log(todos);
// })

// Todo.findById(_id).then((todos) => {
//     console.log(todos);
// })

const _id = '5e5cc1cc81cd9619be5f2de8';

if(!ObjectID.isValid(_id)){
    return console.log('user id is invalid');
}

User.findById(_id).then((user) => {
    if(!user){
        return console.log('please recheck the user id');
    }
    console.log(`user: ${JSON.stringify(user, undefined, 3)}`);
}).catch((err) => {

})