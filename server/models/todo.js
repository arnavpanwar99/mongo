const _ = require('lodash');
const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        default: false,
        type: Boolean
    },
    completedAt: {
        type: Number,
        default: null
    }
});

const saveTodo = async (todoObject, res) => {
    try {
        const newTodo = new Todo(todoObject);
        const response = await newTodo.save();
        res.send(response);
        // Mongoose.disconnect();
    } catch (error) {
        res.status(400).send(error);
        // Mongoose.disconnect();
    } 
}

const getAll = async (res) => {
    try {
        const response = await Todo.find();
        res.send({todos: response})
    } catch (error) {
        res.status(400).send(error);
    }
} 

const getById = async (id, res) => {
    try {
        const todo = await Todo.findById(id);
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo})
    } catch (error) {
        res.status(400).send(error);
    }
}

const deleteById = async (id, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(id);
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo, deleted: true});
    } catch (error) {
        res.status(400).send(error);
    }
}

const updateTodo = async (id, body, res) => {
    const { text = '', completed = false } = body;
    if(_.isBoolean(completed) && completed === true){
        body.completedAt = new Date().getTime();
    }else{
        body.completedAt = null;
        body.completed = false;
    }

    try {
        const todo = await Todo.findByIdAndUpdate(id, {
            $set: body
        }, {
            new: true
        });

        if(!todo){
            return res.status(404).send();
        }

        res.send({todo});
    } catch (error) {
        res.status(400).send();
    }
}

module.exports = {
    Todo,
    saveTodo,
    getAll,
    getById,
    deleteById,
    updateTodo,
}