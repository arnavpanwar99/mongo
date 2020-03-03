const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models//todo');

Todo.findByIdAndDelete('5e5ce58ce5aea32e69ca602c').then((todo) => {
    console.log(todo);
})
