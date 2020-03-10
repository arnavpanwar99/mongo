// const { SHA256 } = require('crypto-js');
const { sign, verify } = require('jsonwebtoken');

// const data = {
//     id: 10
// };

// const token = sign(data, '123abc');
// console.log(token);

// const decoded = verify(token, '123abc');

// console.log(decoded);

const bcrypt = require('bcryptjs');

const password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     })
// })

// const hashedPassword = '$2b$10$PVeH1sYPO6HXeAgwsOUgn.EvfkpEuWzD5/ej/Q6Q7Qy/jBXrNsvA2';


// bcrypt.compare(password, hashedPassword, (err, res) => {
//     console.log(res);
// })

// console.log(sign('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTY2NjIxZjYwZWI0ZjJhZjE3YTFhNWUiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTgzNzY4MDk1fQ.Ym2KajO_CH73Gp7rCvi0Rgzkrv5hf9gfrErTWeQlTME', 'abc123'));