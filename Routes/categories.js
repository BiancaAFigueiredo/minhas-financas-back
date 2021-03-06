const express = require('express');
const router = express.Router();
const Categories = require("../model/categories");
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
        const categories = await Categories.find({});
        return res.send(categories);
    }
    catch (err){
        return res.status(500).send({error: "Erro na consulta de categorias! "});
    }
});

router.post('/create', async (req, res) => {
    const {name} = req.body;

    if( !name) return res.status(400).send({error: "Dados insuficientes! "});

    try{
        if(await Categories.findOne({ name })) return res.status(400).send({ error:"Categoria já registrada!"})

        const categorie = await Categories.create(req.body);
        return res.status(201).send({categorie});
    }
    catch(err){
        console.error(err)
        return res.status(500).send({ error: 'Erro ao criar categoria' });
    }
})

router.put('/update/:categId', async (req, res) => {
    const {name} = req.body;
    const {categId }= req.params

    if(!name) return res.status(400).send({error: "Dados insuficientes! "});

    try{
        if(await Categories.findOne({ _id: categId })){
            const categorie = await Categories.updateOne({name:name});
            return res.status(201).send({categorie});
        }else {
            return res.status(500).send({error: 'Esta Categoria não existe' });
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).send({ error: 'Erro ao alterar Categoria' });
    }
})

router.delete('/delete/:categId', async (req, res) => {
    try{
        const categoryId = req.params.categId
            const categorie = await Categories.deleteOne({_id:categoryId});
            return res.status(201).send({categorie});
    }
    catch(err){
        console.log(err)
        return res.status(500).send({ error: 'Erro ao excluir Categoria'})
    }
})

router.post("/auth", async(req, res) => {
    const { email, password } = req.body;

    if(!email || !password) return res.status(400).send({ error: "Dados insuficientes!" });

    try{
        const user = await Users.findOne({email}).select('+password');
        if(!user) return res.status(400).send({ error: 'Usuário não registrado!'})
        
        const pass_ok = await bcrypt.compare(user.password, password);

        if(!pass_ok) return res.status(401).send({ error: 'Erro ao autenticar usuário! '});

        user.password = undefined;
        return res.send({user, token: createUserToken(user.id)});

    }
    catch(err){
        return res.status(500).send({ error: "Usuário não registrado!" });
    }
})

module.exports = router;

