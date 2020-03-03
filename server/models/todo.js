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
        res.send(400).send(error);
    }
}

deleteById = async (id, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(id);
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo, deleted: true});
    } catch (error) {
        res.send(400).send(error);
    }
}

module.exports = {
    Todo,
    saveTodo,
    getAll,
    getById,
    deleteById
}