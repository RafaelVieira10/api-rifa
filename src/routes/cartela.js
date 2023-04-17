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
      [req.body.nome, req.body.status, req.body.situacao],
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
          response: `ID ${id} alterado com sucesso`
        })
      }
    )
  })
})

module.exports = router;
