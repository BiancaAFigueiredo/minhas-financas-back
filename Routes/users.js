const express = require('express');
const router = express.Router();
const Users = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const config = require('../config/config')

//Funções Auxiliares
const createUserToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwt_pass, {expiresIn: config.jwt_expires_in });
}

router.get('/', async (req, res) => {
    //Código refatorado com async/await
    try{
        const users = await Users.find({});
        return res.send(users);
    }
    catch (err){
        return res.status(500).send({error: "Erro na consulta de usuários! "});
    }
});

router.post('/create', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ error: 'Dados insuficientes!' });

    try {
        if (await Users.findOne({ email })) return res.status(400).send({ error: 'Usuário já registrado!'});

        const user = await Users.create(req.body);
        user.password = undefined;

        return res.status(201).send({user, token: createUserToken(user.id)});
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro ao buscar usuário!' });
    }
});



module.exports = router;

