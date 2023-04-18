const express = require("express");
const router = express.Router();
const mysql = require("../../mysql").pool;

//ROTA QUE TRAZ TODOS OS DADOS DO BANCO
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

//ROTA QUE TRAZ OS DADOS DE UM ID ESPECIFICO
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

//ROTA QUE INSERE DADOS NO BANCO
router.post("/", (req, res) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    const {nome, status, situacao} = req.body;
    conn.query(
      `INSERT INTO cartela (nome, status, situacao) VALUES ('${nome}','${status}','${situacao}')`,
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
          produtosInseridos: [{"nome": nome, "status" : status, "situacao" : situacao}],
        });
      }
    );
  });
});

//ROTA QUE ALTERA OS DADOS DE UM ID ESPECIFICO
router.put("/:id_cartela", (req, res) => {
  mysql.getConnection((error, conn) => {
   const {nome, status, situacao} = req.body
   const id = req.params.id_cartela
    if(error) {
      return res.status(500).send({error: error});
    }
    console.log(req.body)
    conn.query(
      `UPDATE cartela SET nome = '${nome}', status = '${status}', situacao = '${situacao}' WHERE id_cartela = '${id}'`,
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({error : error});
        }
        res.status(200).send({
          response: `Dado(s) do ID ${id} alterado(s) com sucesso`
        });
      }
    );
  });
});

//ROTA QUE DELETE OS DADOS DE UM ID ESPECIFICO
router.delete("/:id_cartela", (req, res) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("DELETE FROM cartela WHERE id_cartela = ?;", 
    [req.params.id_cartela],
    (error, resultado, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      res.status(200).send({
        response: `ID: ${req.params.id_cartela} excluído com sucesso`,
      });
    });
  });
});


module.exports = router;
