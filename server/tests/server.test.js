const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const _id = new ObjectID();

const todos = [{
    text: 'first',
    _id
} ,{
    text: 'second'
}]


beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos).then(() => done())
    });
})

describe('POST/todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Ignore everyone';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done()
                }).catch((err) => done(err));
            })
    })
    
    it('should not create todo with invalid body data', (done) => {
        
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done()
                }).catch((err) => done(err));
            })
    })
})

describe('GET/todos', () => {
    it('should fetch list of all todos', (done) => {

        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })
})

describe('GET /todos/:id', () => {
    it('should fetch correct todo with specific id', (done) => {
        request(app)
            .get(`/todos/${_id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('first')
            })
            .end(done);
    })

    it('should not fetch todo for invalid ObjectID', (done) => {
        request(app)
            .get('/todos/asdae333ert3')
            .expect(404)
            .end(done);
    })

    it('should not fetch todo for incorrect ObjectID',(done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    })
})