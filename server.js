import express from 'express';
import { PrismaClient } from './generated/prisma/index.js';
import { request } from 'https';


const prisma = new PrismaClient();
const app = express();
app.use(express.json());



//HTTP Post - criar usuário
app.post('/users', async (req,res) => {

    await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age 
        }
    });
    users.push(req.body);
    res.status(201).json(req.body);

});



//HTTP Get - Listar usuários
app.get('/users', async (req,res) => {

    const users = await prisma.user.findMany();
    res.status(200).json(users);

});


//HTTP Put - Editar usuário
app.put('/users/:id', async (req, res) => {

    const userId = req.params.id;
    const { email, name, age } = req.body;
    
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                email,
                name,
                age
            }
        });

        return res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Erro ao atualizar o usuário:", error);
        
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});

//HTTP Delete - deletar usuário
app.delete('/users/:id', async (req,res) => {

   await prisma.user.delete({

        where: {
            id: req.params.id
        }
   });

   return res.status(204).send()


});





app.listen(3000)











/*
        Criar a API de usuários

-criar um usuário
-listar os usuários
-editar o usuário
-deletar um úsuario

        salvar todas essas informações em um banco de dados
*/