const { MongoClient, ObjectID } = require('mongodb');

const configObj = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

const mongoFindTodo = async () => {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017/TodoApp', configObj);
        const db = client.db('TodoApp');
        const response = db.collection('Todos').find();
        const result = await response.count();

        console.log(result)

        await client.close();
    } catch (error) {
        console.log(`the error is: ${error}`);
    }
}

const mongoFindUser = async () => {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017/TodoApp', configObj);
        const db = client.db('TodoApp');
        const response = db.collection('Users').find({
            name: 'Raveesh'
        })
        const result = await response.toArray();
        console.log(result);

        await client.close();
    } catch (error) {
        console.log(`error is: ${error}`)
    }
}


mongoFindUser();