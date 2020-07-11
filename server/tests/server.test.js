const { ObjectID } = require('mongodb');
const request = require('supertest');
const expect = require('expect');

const { populateTodos, todos, _id, populateUsers, users } = require('./seed/seed');
const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST/todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Ignore everyone';
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    })
})

describe('GET /todos/:id', () => {
    it('should fetch correct todo with specific id', (done) => {
        request(app)
            .get(`/todos/${_id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('first')
            })
            .end(done);
    })

    it('should not fetch todo for invalid ObjectID', (done) => {
        request(app)
            .get('/todos/asdae333ert3')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    })

    it('should not fetch todo for incorrect ObjectID',(done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    })
})

describe('DELETE/todos/:id', () => {
    it('should delete correct todo with specific id', (done) => {
        request(app)
            .delete(`/todos/${_id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    })

    it('should not delete todo for incorrect ObjectID',(done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    })
})


describe('PATCH /todos/:id', () => {
    it('should update completed property of todo to true', (done) => {
        request(app)
            .patch(`/todos/${_id}`)
            .set('x-auth', users[0].tokens[0].token)
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

})

describe('POST /users', () => {
    it('should post users with correct data', (done) => {
        const user = {
            email: 'you@example.com',
            password: '123456789',
        }
        request(app)
            .post('/users')
            .send(user)
            .expect(200)
            .expect((res) => {
                expect(!!res.headers['x-auth']).toBe(true);
                expect(!!res.body._id).toBe(true);
                expect(!!res.body.email).toBe(true);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                User.find({ email: 'you@example.com' }).then((users) => {
                    expect(users.length).toBe(1);
                    expect(users[0].email).toBe('you@example.com');
                    done();
                }).catch((err) => {
                    done(err);
                })
            });
    });

    it('should not post user with incomplete data', (done) => {
        request(app)
            .post('/users')
            .send({email: 'dads@ds.dsr'})
            .expect(400)
            .end(done);
    });

    it('should not create user if email already exists', (done) => {
        request(app)
            .post('/users')
            .send(users[0])
            .expect(400)
            .end(done);
    })
});

describe('GET /users/me', () => {
    it('should fetch user with correct header', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(users[0].email);
                expect(res.body._id).toBe(users[0]._id.toHexString());
            })
            .end(done);
    });

    it('should not fetch user with incorrect header', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', 'somerandomstring123')
            .expect(401)
            .expect((res) => {
                expect(res.body.email).toBe(undefined);
                expect(res.body._id).toBe(undefined);
            })
            .end(done);
    })
})

describe('POST /login/user', () => {
    const validUser = {
        email: users[0].email,
        password: users[0].password
    }
    const inValidUserOne = {
        email: 'arnavpanwar99@gmail.com',
        password: 'itdoesntmatter'
    }
    const inValidUserTwo = {
        email: users[0].email,
        password: 'againitdoesntmatter'
    }
    it('should login user with valid credentials', (done) => {
        request(app)
            .post('/users/login')
            .send(validUser)
            .expect(200)
            .expect((res) => {
                expect(!!res.headers['x-auth']).toBe(true);
                expect(res.body.email).toBe(validUser.email);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findOne({email: validUser.email}).then((user) => {
                    const { tokens } = user;
                    const match = tokens.filter((item) => item.token===res.headers['x-auth']);
                    expect(match[0].token).toBe(res.headers['x-auth']);
                    done();
                }).catch((err) => done(err));
            });
    })
    it('should not login user with invalid email', (done) => {
        request(app)
            .post('/users/login')
            .send(inValidUserOne)
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('user not found');
            })
            .end(done);
    })
    it('should not login user with incorrect password', (done) => {
        request(app)
            .post('/users/login')
            .send(inValidUserTwo)
            .expect(400)
            .expect((res) => {
                expect(res.body.error).toBe('incorrect password');
            })
            .end(done);
    })
})

describe('DELETE /users/me/token', () => {
    it('should remove token from tokens array', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findOne({email: users[0].email}).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err) => done(err));
            })
    })
    it('should return 401 if token i.e, user is not logged in', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', 'somerandomshit1234')
            .expect(401)
            .end(done);
    })
})