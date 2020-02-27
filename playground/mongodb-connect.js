const { MongoClient, ObjectID } = require('mongodb');


const configObject =  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}


const useMongo = async () => {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017/TodoApp', configObject);
        const db = client.db('TodoApp');
        
        await client.close();
    } catch (error) {
        console.log(`the error is: ${error}`);
    }
}

useMongo();
