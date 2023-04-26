const express = require('express')
const cartela = require('./src/routes/cartela')
const comprador = require('./src/routes/comprador')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
app.use(express.json()); // json é passado para o req.body
app.use(bodyParser.urlencoded({extended: false})); //apenas dados simples
app.use(bodyParser.json()); //json de entrada no body
app.use(cors());

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
app.use('/comprador', comprador);


app.listen(8080, () => {
    console.log('Servidor foi iniciado'),
    app.use((req, res) => {
        res.status(200).send({mensagem : "API Rifa funcionando!"})
    });
})


