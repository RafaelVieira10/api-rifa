const express = require("express");
const router = express.Router();
const mysql = require("../../mysql").pool;

//ROTA QUE TRAZ TODAS AS RIFAS DISPONIVEIS
router.get("/:disponivel", (req, res) => {
  mysql.getConnection((error, conn) => {
    if(error) {
      res.status(500).send({error: error})
    }
    const paramDisponivel = req.params.disponivel;
    conn.query(
      `SELECT * FROM cartela WHERE status = "${paramDisponivel}";`,
      (error, resultado, fields) => {
        if (error) {
          res.status(500).send({error : error})
        }
        res.status(200).send({
          cartela : resultado
        })
      }
    )
  })
})

//ROTA QUE TRAZ TODAS AS RIFAS VENDIDAS
router.get("/:vendida", (req, res) => {
  mysql.getConnection((error, conn) => {
    if(error) {
      res.status(500).send({error: error})
    }
    const paramVendida = req.params.vendida;
    conn.query(
      `SELECT * FROM cartela INNER JOIN comprador ON comprador.id_comprador = cartela.id_cartela WHERE status = "${paramVendida}";`,
      (error, resultado, fields) => {
        if (error) {
          res.status(500).send({error : error})
        }
        res.status(200).send({
          response: {
            cartela: resultado.map((result) => {
              return {
                id_cartela: result.id_cartela,
                nome: result.nome,
                status: result.status,
                situacao: result.situacao,
                comprador: {
                  id_comprador: result.id_comprador,
                  nome: result.nome_comprador,
                  telefone: result.telefone,
                  data_compra: result.data_compra,
                  request: {
                    tipo: "GET",
                  },
                },
              };
            }),
          },
        })
      }
    )
  })
})

//ROTA QUE TRAZ TODOS OS DADOS DO BANCO
router.get("/", (req, res) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `SELECT * FROM cartela INNER JOIN comprador ON comprador.id_comprador = cartela.id_cartela;`,
      (error, resultado, fields) => {
        if (error) {
          res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(200).send({
          response: {
            cartela: resultado.map((result) => {
              return {
                id_cartela: result.id_cartela,
                nome: result.nome,
                status: result.status,
                situacao: result.situacao,
                comprador: {
                  id_comprador: result.id_comprador,
                  nome: result.nome_comprador,
                  telefone: result.telefone,
                  data_compra: result.data_compra,
                  request: {
                    tipo: "GET",
                  },
                },
              };
            }),
          },
        });
      }
    );
  });
});

//ROTA QUE TRAZ OS DADOS DE UM ID ESPECIFICO
router.get("/:id_cartela", (req, res) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    const id_cartela = req.params.id_cartela;
    conn.query(
      `SELECT * FROM cartela INNER JOIN comprador ON comprador.id_comprador = cartela.id_cartela WHERE id_cartela = '${id_cartela}';`,
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        res.status(200).send({
          response: {
            cartela: resultado.map((result) => {
              return {
                id_cartela: result.id_cartela,
                nome: result.nome,
                status: result.status,
                situacao: result.situacao,
                comprador: {
                  id_comprador: result.id_comprador,
                  nome: result.nome,
                  telefone: result.telefone,
                  data_compra: result.data_compra,
                  request: {
                    tipo: "GET",
                  },
                },
              };
            }),
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
    const { nome, status, situacao } = req.body;
    if (!nome) {
      return res.status(422).send({ mensagem: "O nome é obrigatório" });
    }
    if (!status) {
      return res.status(422).send({ mensagem: "O status é obrigatório" });
    }
    if (!situacao) {
      return res.status(422).send({ mensagem: "A situação é obrigatória" });
    }

    if (status == "disponivel") {
      if (situacao == "paga") {
        return res.status(422).send({ mensagem: "ERRO : Situação = paga, mas a rifa está disponivel" });
      }
    }
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
          produtosInseridos: [
            { nome: nome, status: status, situacao: situacao },
            
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
router.put("/:id_cartela", (req, res) => {
  mysql.getConnection((error, conn) => {
    const { nome, status, situacao } = req.body;
    const id = req.params.id_cartela;
    if (error) {
      return res.status(500).send({ error: error });
    }
    console.log(req.body);
    conn.query(
      `UPDATE cartela SET nome = '${nome}', status = '${status}', situacao = '${situacao}' WHERE id_cartela = '${id}'`,
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        res.status(200).send({
          response: `Dado(s) do ID ${id} alterado(s) com sucesso`,
          request: {
            tipo: "PUT",
          },
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
    conn.query(
      "DELETE FROM cartela WHERE id_cartela = ?;",
      [req.params.id_cartela],
      (error, resultado, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        res.status(200).send({
          response: `ID: ${req.params.id_cartela} excluído com sucesso`,
          request: {
            tipo: "DELETE",
          },
        });
      }
    );
  });
});

module.exports = router;
