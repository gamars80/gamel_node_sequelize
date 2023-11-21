const express = require('express');
const db = require('./models');
const app = express();
const port = 8080;
const User = db.users;

//데이터베이스를 모두 비워주고 스키마통해 재생성
// db.sequelize.sync({force: true}).then(() => {
//     console.log('데이터베이스 drop 및 sync를 다시 맞춤')
// })

app.use(express.json());

app.post('/users', (req,res) => {
    const {firstName, lastName, hasCar} = req.body;

    const user = {
        firstName,
        lastName,
        hasCar
    } 

    User.create(user)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || '유저생성 실패'
        })
    })
})


app.get('/users', (req, res) => {
    User.findAll()
    .then(users => {
        res.send(users);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || '유저정보 조회 실패'
        })
    })
});

app.get('/users/:id', (req ,res) => {
    const id = req.params.id;
    User.findByPk(id)
    .then(user => {
        if(user) {
            res.send(user);
        }else{
            res.status(404).send({
                message: `id ${id} 인 유저가 없습니다`
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || `${id} 인 유저를 찾을수 없습니다`
        })
    })
});

app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    User.update(req.body, {
        where: {id}
    })
    .then(result => {
        if(result[0] === 1){
            res.send('업데이트 성공');
        }else{
            res.send(`${id} 에 맞는 유저가 없습니다.`);
        }
        
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || `${id} 인 유저를 업데이트에 실패했습니다.`
        })
    })
});


app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    User.destory({
        where: {id}
    })
    .then(num => {
        if(num == 1 ) {
            res.send({
                message: '삭제 성공'
            })
        }else{
            res.send({
                message: '유저 존재하지 않음'
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || `${id} 인 유저 삭제에 실패했습니다.`
        })
    })
})

app.listen(port, () => {
    console.log(`${port} 포트에서 서버 실행`);
});
