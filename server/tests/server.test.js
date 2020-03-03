const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const _id = new ObjectID();

const todos = [{
    text: 'first',
    completed: false,
    _id
} ,{    
    text: 'second',
    completed: true,
    _id: new ObjectID()
}]

beforeEach('description', (done) => {
    Todo.deleteMany({}).then(() => {
        Todo.insertMany(todos)
        return done();
    })  
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

describe('DELETE/todos/:id', () => {
    it('should delete correct todo with specific id', (done) => {
        request(app)
            .delete(`/todos/${_id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('first');
                expect(res.body.deleted).toBe(true);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(_id).then((todo) => {
                    expect(todo).toBeNull();
                    done();
                }).catch((err) => {
                    done(err);
                })
            });
    })

    it('should not delete todo for invalid ObjectID', (done) => {
        request(app)
            .delete('/todos/asdae333ert3')
            .expect(404)
            .end(done);
    })

    it('should not delete todo for incorrect ObjectID',(done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    })
})


describe('PATCH /todos/:id', () => {
    it('should update completed property of todo to true', (done) => {
        request(app)
            .patch(`/todos/${_id}`)
            .send({
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }

                Todo.findById(_id).then((todo) => {
                    expect(todo.completed).toBe(true);
                    done();
                }).catch((err) => {
                    done(err);
                })
            })
    })

    it('should update completed property of todo to false', (done) => {
        request(app)
            .patch(`/todos/${todos[1]._id}`)
            .send({
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeNull;
            })
            .end((err) => {
                if(err){
                    return done(err);
                }

                Todo.findById(todos[1]._id).then((todo) => {
                    expect(todo.completed).toBe(false);
                    expect(todo.completedAt).toBeNull;
                    done();
                }).catch((err) => {
                    done(err);
                })
            })
    })
})