import express from 'express';

const app = express()


app.get('/users', (req,res) => {

   res.send("Deu certo!!")


})


app.listen(3000)