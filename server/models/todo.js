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

module.exports = {
    Todo,
    saveTodo,
}