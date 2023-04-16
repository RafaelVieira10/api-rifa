const express = require("express");
const router = express.Router();
const mysql = require("../../mysql").pool;


router.post("/", (req, res) => {
  mysql.getConnection((error, conn) => {
    const dados = {
      nome: req.body.nome,
      status: req.body.status,
      situacao: req.body.situacao,
    };
    conn.query(
      'INSERT INTO cartela (nome, status, situacao) VALUES (?,?,?)',
      //   [req.body.nome, req.body.status, req.body.situacao],
      (error, resultado, field) => {
        conn.release();
        if (error) {
          res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.send({
          mensagem: "Dados inseridos com sucesso",
          produtosInseridos: dados,
        });
      }
    );
  });
});

module.exports = router;

// método GET para puxar os dado(s) //
// router.get('/:id',(req, res) => {
//     console.log(`Id: ${req.params.id}`);
//     res.send(`GET Id: ${req.params.id}`)
// })

// //método POST para adicionar os dado(s)
// router.post('/:id', (req,res) => {
//     console.log(req.body)
//     res.send(`POST ID: ${req.params.id}`)
// })

// //método PUT para atualizar dado(s)
// router.put('/:id', (req,res) => {
//     console.log(req.body)
//     res.send(`PUT ID: ${req.params.id}`)
// })

// // método DELETE para deletar os dado(s)
// router.delete('/:id', (req,res) => {
//     console.log(req.body)
//     res.send(`DELETE ID: ${req.params.id}`)
// })
