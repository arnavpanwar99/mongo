const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const  { User } = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    saveTodo({
        text: req.body.text,
        completed: req.body.completed
    }, res);
})

app.listen('3000', () => console.log('started on port 3000'));


// const saveUser = async (userObject) => {
//     try {
//         const newUser = new User(userObject);
//         const response = await newUser.save();
//         console.log(response);

//         mongoose.disconnect();
//     } catch (error) {
//         console.log(`the error is: ${error}`)
//         mongoose.disconnect();
//     }
// }

const saveTodo = async (todoObject, res) => {
    try {
        const newTodo = new Todo(todoObject);
        const response = await newTodo.save();
        res.send(response);
        mongoose.disconnect();
    } catch (error) {
        res.status(400).send(error);
        mongoose.disconnect();
    } 
}

// // saveTodo({
// //     text: 'its a todo as well',
// //     completed: 'falsedd',
// // })

// saveUser({
//     email: '  '
// })

// // const newTodo = new Todo({
// //     text: 'Cook Dinner'
// // })

// // newTodo.save().then((doc) => {
// //     console.log(`Saved todo: ${doc}`)
// // }).catch((err) => {
// //     console.log(`the error is: ${err}`);
// // });