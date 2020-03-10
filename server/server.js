const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { authenticate } = require('./middleware/authenticate');
const { mongoose } = require('./db/mongoose');
const { Todo, saveTodo, getAll, getById, deleteById, updateTodo } = require('./models/todo');
const  { User, saveUser, loginUser, removeToken } = require('./models/user');

const app = express();

const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const body = _.pick(req.body, ['text']);
    saveTodo(body, res);
})

app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    saveUser(body, res);
})

app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    loginUser(body, res);
})

app.get('/todos', (req, res) => {
    getAll(res);
})

app.get('/todos/:id', (req, res) => {
    const { id } = req.params;
    
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    getById(id, res);
})


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
})

app.delete('/todos/:id', (req,res) => {
    const { id } = req.params;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    deleteById(id, res);
})

app.delete('/users/me/token', authenticate, (req, res) => {
    const { user, token } = req;
    removeToken(token, user, res);
})

app.patch('/todos/:id', (req, res) => {
    const { id } = req.params;
    const body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    updateTodo(id, body, res);
})

app.listen(port, () => console.log(`started on port ${port}`));

module.exports = {
    app,
}