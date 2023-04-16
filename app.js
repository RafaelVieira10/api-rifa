const express = require('express')
const morgan = require('morgan')
const cartela = require('./src/routes/cartela')
const bodyParser = require('body-parser')

const app = express();
app.use(express.json()); // json é passado para o req.body
app.use(bodyParser.urlencoded({extended: false})); //apenas dados simples
app.use(bodyParser.json()); //json de entrada no body

app.use((req, res, next) => {
    res.header('Access-Controll-Allow-Origin', '*'), //Acesso-Controle-Permitir-Origem
    res.header('Access-Controll-Allow-Header', 'Origin, Content-Type, X-Requested-With, Accept, Authorization'); //informar quais cabecalhos vão ser aceito

    if (req.method === 'OPTIONS') {
        res.header('Access-Controll-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
})

app.use('/cartela', cartela);


app.listen(3000, () => {
    console.log('Servidor foi iniciado');
})

