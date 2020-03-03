const mongoose = require('mongoose');

const configObject = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const URL = 'mongodb+srv://arnav:arnavozil@cluster0-laaif.mongodb.net/test?retryWrites=true&w=majority';

const URI = 'mongodb://localhost:27017/TodoApp';

mongoose.connect(URL, configObject).then(() => console.log('connected'))
.catch((err) => console.log('there is some error'));

module.exports = {
    mongoose,
}