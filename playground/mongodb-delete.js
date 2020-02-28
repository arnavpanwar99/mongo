const { MongoClient, ObjectID } = require('mongodb');

const configObj = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

const mongoTodo = async () => {
    const client = await MongoClient.connect('mongodb://localhost:27017/TodoApp', configObj);
    const db = client.db('TodoApp');
    const response = await db.collection('Todos').deleteMany({
        text: 'have lunch'
    })
    console.log(`total of ${response.deletedCount} documents deleted!!`);
    
    await client.close();
}

mongoTodo();