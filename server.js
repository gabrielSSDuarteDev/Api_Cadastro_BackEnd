import express from 'express';
import { PrismaClient } from './generated/prisma/index.js';


const prisma = new PrismaClient();
const app = express();
app.use(express.json());




//HTTP Post - criar usuário
app.post('/users', async (req,res) => {

    const {email, name, age} = req.body;
    const ageAsNumber = Number(age)
    

    if(isNaN(ageAsNumber)){
        return res.status(400).json({message: "O campo 'age' ou 'idade' deve ser um número válido."})
    }

    try{
        const addUser = await prisma.user.create({
             data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age 
        }

        });

        return res.status(201).json(addUser);
    }
    catch(error){
        console.log("Falha ao criar usuário: ", error);

        if(error.code === 'P2002'){
            return res.status(409).json({
                message: `O email ${email} já está cadastrado.`,
                field: "email"
            });
        }

        return res.status(500).json({message: "Erro interno do servidor. "});

    }
});



//HTTP Get - Listar usuários
app.get('/users', async (req,res) => {

    try{
          let users = [];
          const {name, email, age} = req.query;
          let elementoContem = {};
   

    if (name){
        elementoContem.name = {contains: name, mode: 'insensitive' };
    }
    if(email){
        elementoContem.email = {contains: email, mode: 'insensitive'};
    }
    if(age){
        const ageAsNumber = Number(age);
        if(!isNaN(ageAsNumber)) {
            elementoContem.age = ageAsNumber
        }
    }

    users = await prisma.user.findMany({
        where: elementoContem
    });
    
    return res.status(200).json(users);
  
 } catch(error)  {

        console.error("Erro ao identificar usuários: ");
        return res.status(500).json({
            message: `Erro interno nos usuários.`
        });
 }

});


//HTTP Put - Editar usuário
app.put('/users/:id', async (req, res) => {

    const userId = req.params.id;
    const { email, name, age } = req.body;


    let updateData = {};
    if(email !== undefined) updateData.email = email;
    if(name !== undefined) updateData.name = name; 

    if(age !== undefined) {
        updateData.age = String(age);
     }
    
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: 
               updateData
        
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

   const userId = req.params.id;

    try {
        await prisma.user.delete({

            where: {
                id: userId
            }
        });

        return res.status(204).json({
            message: `Usuario Deletado com sucesso`
        });

    } catch (error) {
        console.error("Erro ao deletar o usuário:", error);
        
        
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Usuário não encontrado para exclusão." });
        }

        
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}.`);
});
