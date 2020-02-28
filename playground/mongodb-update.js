const { MongoClient, ObjectID } = require('mongodb');

const configObject = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

const mongoTodo = async () => {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017/TodoApp', configObject);
        const db = client.db('TodoApp');
        const response = await db.collection('Todos').findOneAndUpdate({
            completed: false
        },{
            $set: {
                completed: true
            }
        }, {
            returnOriginal: false
        });
        console.log(response);
        await client.close();
    } catch (error) {
        console.log(`error is: ${error}`)
    }
}

const mongoUser = async () => {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017/TodoApp');
        const db = client.db('TodoApp')
        const response = await db.collection('Users').findOneAndUpdate({
            _id: new ObjectID('5e57ad80999e5e23047f1c21')
        }, {
            $set: {
                name: 'Panwar'
            },
            $inc: {
                age: 10
            }
        }, {
            returnOriginal: false
        })
        console.log(response);

        await client.close()
    } catch (error) {
        console.log(`the error is: ${error}`);
    }
}

mongoUser();
