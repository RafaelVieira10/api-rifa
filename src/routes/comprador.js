const express = require("express");
const router = express.Router();
const moment = require("moment");
const mysql = require("../../mysql").pool;

//ROTA QUE TRAZ TODOS OS DADOS DO BANCO
router.get("/", (req, res) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM comprador", (error, resultado, fields) => {
      conn.release();
      if (error) {
        res.status(500).send({
          error: error,
          response: null,
        });
      }
      res.send({
        response: resultado,
        request: {
          tipo: "GET",
        },
      });
    });
  });
});

//ROTA QUE TRAZ OS DADOS DE UM ID ESPECIFICO
router.get("/:id_comprador", (req, res) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    const id_comprador = req.params.id_comprador;
    conn.query(
      `SELECT * FROM comprador WHERE id_comprador = '${id_comprador}'`,
      (error, resultado, fields) => {
        conn.release();
        if (error) {
          res.status(500).send({
            error: error,
            response: null,
          });
        }
        if (resultado == "") {
          res.status(422).send({mensagem : "Não possui dados nesse ID"})
        }
        res.send({
          response: resultado,
          request: {
            tipo: "GET",
          },
        });
      }
    );
  });
});

//ROTA QUE INSERE DADOS NO BANCO
router.post("/", (req, res) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    const { nome, telefone } = req.body;
    const data_compra = moment().format("DD/MM/YYYY hh:mm:ss");

    if (!nome) {
      return res.status(422).send({ mensagem: "O nome é obrigatório" });
    }
    if (!telefone) {
      return res.status(422).send({ mensagem: "O telefone é obrigatório" });
    }

    if (telefone.length != 11) {
        return res.status(422).send({ mensagem: "Telefone errado" });
    }
    conn.query(
      `INSERT INTO comprador (nome, telefone, data_compra) VALUES ('${nome}', '${telefone}', '${data_compra}')`,
      (error, resultado, fields) => {
        conn.release();
        if (error) {
          res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.send({
          mensagem: "Dados inseridos com sucesso",
          dadosComprador: [
            { nome: nome, telefone: telefone, data_compra: data_compra },
          ],
          request: {
            tipo: "POST",
          },
        });
      }
    );
  });
});

//ROTA QUE ALTERA OS DADOS DE UM ID ESPECIFICO
router.put("/:id_comprador", (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({error : error})
        }
        const {nome, telefone} = req.body;
        const id_comprador = req.params.id_comprador;
        if (!nome) {
            return res.status(422).send({ mensagem: "Nome é obrigatório" });
        }
        if (!telefone) {
            return res.status(422).send({ mensagem: "Telefone é obrigatório" });
        }
        if (telefone.length != 11) {
          return res.status(422).send({ mensagem: "Telefone errado" });
      }
        conn.query(
            `UPDATE comprador SET nome = '${nome}', telefone =  '${telefone}' WHERE id_comprador = '${id_comprador}'`,
            (error, resultado, fileds) => {
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response : null
                    })
                }
                res.send({
                    mensagem: `Dado(s) do ID: ${id_comprador} alterado(s) com sucesso`,
                    request: {
                      tipo: "PUT",
                    },
                });
            }
        );
    });
});

//ROTA QUE DELETE OS DADOS DE UM ID ESPECIFICO
router.delete("/:id_comprador", (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({error: error})
        }
        const id_comprador = req.params.id_comprador;
        conn.query(
            `DELETE FROM comprador WHERE id_comprador = '${id_comprador}'`,
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error : error,
                        response : null
                    })
                }
                res.send({
                    mensagem : `Dados do ID '${id_comprador} excluídos com sucesso'`,
                    request: {
                      tipo: "DELETE",
                    },
                });
            }
        );
    });
});

module.exports = router;
