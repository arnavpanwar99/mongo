const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo, saveTodo, getAll, getById, deleteById } = require('./models/todo');
const  { User } = require('./models/user');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    saveTodo({
        text: req.body.text,
        completed: req.body.completed
    }, res);
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

app.delete('/todos/:id', (req,res) => {
    const { id } = req.params;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    deleteById(id, res);
})

app.listen(port, () => console.log(`started on port ${port}`));

module.exports = {
    app,
}