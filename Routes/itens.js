const express = require('express');
const router = express.Router();
const Itens = require("../model/itens");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { query } = require('express');

//Funções Auxiliares
const createUserToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwt_pass, {expiresIn: config.jwt_expires_in });
}

router.get('/:categId', async (req, res) => {
    //Código refatorado com async/await
    let categ = req.params.categId;
    console.log('ID DA CATEGORIA ', categ)
    try{
        const itens = await Itens.find({categoryId: categ});
        console.log('ITENS ', itens)
        return res.status(200).send(itens);
    }
    catch (err){
        console.error(err)
        return res.status(500).send({error: "Erro na consulta de itens! "});
    }
});

router.post('/create', async (req, res) => {
    const {expend, description, categoryId} = req.body;

    if(!description || !expend) return res.status(400).send({error: "Dados insuficientes! "});

    try{
        if(await Itens.findOne({ categoryId:categoryId, description:description })) return res.status(400).send({ error:"Item já registrado!"})

        const itens = await Itens.create(req.body);
        return res.status(201).send({itens});
    }
    catch(err){
        console.error(err)
        return res.status(500).send({ error: 'Erro ao cadastrar item' });
    }
})
router.delete('/delete/:itemId', async (req, res) => {
    const {itemId} = req.params;
    const { description } = req.body
    if(!itemId ) return res.status(400).send({error: "Dados insuficientes! "});

    try{

        await Itens.deleteOne({_id:itemId}).exec()
        return res.status(200).send({message:'item deletado'});
    }
    catch(err){
        console.error(err)
        return res.status(500).send({ error: 'Erro ao deletar item' });
    }
})
router.put('/update/:itemId', async (req, res) => {
    const {categId, itemId, expend, description} = req.body;

    if(!categId || !itemId || !description || !expend) return res.status(400).send({error: "Dados insuficientes! "});

    try{
        if(await Itens.findOne({ categId, itemId })) return res.status(400).send({ error:"Item já registrado!"})

        const itens = await Itens.create(req.body);
        return res.status(201).send({itens});
    }
    catch(err){
        return res.status(500).send({ error: 'Erro ao cadastrar item' });
    }
})



module.exports = router;

