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
    },
    _creator: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    }
});

const saveTodo = async (todoObject, res) => {
    try {
        const newTodo = await new Todo(todoObject);
        const response = await newTodo.save();
        res.send(response);
        // Mongoose.disconnect();
    } catch (error) {
        res.status(400).send(error);
        // Mongoose.disconnect();
    } 
}

const getAll = async (_creator, res) => {
    try {
        const response = await Todo.find({_creator});
        res.send({todos: response})
    } catch (error) {
        res.status(400).send(error);
    }
} 

const getById = async (id, res, _creator) => {
    try {
        const todo = await Todo.findOne({ _id: id, _creator });
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo})
    } catch (error) {
        res.status(400).send(error);
    }
}

const deleteById = async (id, res, _creator) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: id, _creator });
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo, deleted: true});
    } catch (error) {
        res.status(400).send(error);
    }
}

const updateTodo = async (id, body, res, _creator) => {
    const { text = '', completed = false } = body;
    if(_.isBoolean(completed) && completed === true){
        body.completedAt = new Date().getTime();
    }else{
        body.completedAt = null;
        body.completed = false;
    }

    try {
        const todo = await Todo.findOneAndUpdate({_id: id, _creator }, {
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