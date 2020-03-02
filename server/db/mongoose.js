const mongoose = require('mongoose');

const configObject = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

mongoose.connect('mongodb://localhost:27017/TodoApp', configObject);

const Mongoose = mongoose;

module.exports = {
    mongoose,
}