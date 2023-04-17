const express = require("express");
const router = express.Router();
const mysql = require("../../mysql").pool;

router.post("/", (req, res) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    const dados = {
      nome: req.body.nome,
      status: req.body.status,
      situacao: req.body.situacao,
    };
    conn.query(
      "INSERT INTO cartela (nome, status, situacao) VALUES (?,?,?)",
      // [req.body.nome, req.body.status, req.body.situacao],
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

router.get("/", (req, res) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM cartela", 
    (error, resultado, fields) => {
      if (error) {
        res.status(500).send({
          error: error,
          response: null,
        });
      }
      res.status(200).send({
        response: resultado,
      });
    });
  });
});

router.get("/:id_cartela", (req, res) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM cartela WHERE id_cartela = ?;", 
    [req.params.id_cartela],
    (error, resultado, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      res.status(200).send({
        response: resultado,
      });
    });
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
