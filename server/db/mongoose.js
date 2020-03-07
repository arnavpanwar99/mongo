const mongoose = require('mongoose');

const configObject = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}

const URL = 'mongodb+srv://arnav:arnavozil@cluster0-laaif.mongodb.net/test?retryWrites=true&w=majority';

const URI = 'mongodb://localhost:27017/TodoApp';

const final = process.env.PORT ? URL : URI;


mongoose.connect(final, configObject).then(() => {
    console.log('connected')
})
.catch((err) => console.log(err));

module.exports = {
    mongoose,
}