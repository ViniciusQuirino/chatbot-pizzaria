const { Requests } = require("./requests");
const { encontrarObjetos } = require("./scripts");

async function somarValorTotal(response, msg, client) {
  let valor = 0;

  if (response.cidade == 1) {
    valor = 7;
  } else if (response.cidade == 2) {
    valor = 9;
  }

  if (response.refrigerante == "Coca-cola 2 litros") {
    valor += response.qntrefrigerante * 14;
  } else if (response.refrigerante == "Conquista guaraná 2 litros") {
    valor += response.qntrefrigerante * 8;
  }

  for (let i = 1; i <= 10; i++) {
    if (response["sabor" + i] != null) {
      const resultado = await encontrarObjetos(response["sabor" + i]);
      console.log(resultado);
      if (resultado.length == 1) {
        if (response["tamanho" + i] == "grande") {
          valor += resultado.grande;
          return valor;
        }

        if (response["tamanho" + i] == "média") {
          valor += resultado.media;
          return valor;
        }
      }

      if (resultado.length == 2) {
        if (response["tamanho" + i] == "grande") {
          let maiorValor = -Infinity;

          for (let i = 0; i < resultado.length; i++) {
            if (resultado[i].grande > maiorValor) {
              maiorValor = resultado[i].grande;
              valor += maiorValor;
              return valor;
            }
          }
        }

        if (response["tamanho" + i] == "média") {
          let maiorValor = -Infinity;

          for (let i = 0; i < resultado.length; i++) {
            if (resultado[i].media > maiorValor) {
              maiorValor = resultado[i].media;
              valor += maiorValor;
              return valor;
            }
          }
        }
      }
    }
  }
}

module.exports = { somarValorTotal };
