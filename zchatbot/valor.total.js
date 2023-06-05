const { encontrarObjetos } = require("./scripts");

async function somarValorTotal(response, msg, client) {
  let valor = 0;
  let maiorValor = -Infinity;
  if (response.cidade == 1) {
    valor += 7;
  } else if (response.cidade == 2) {
    valor += 9;
  }

  if (response.refrigerante == "Coca-cola 2 litros") {
    valor += response.qntrefrigerante * 14;
  } else if (response.refrigerante == "Conquista guaraná 2 litros") {
    valor += response.qntrefrigerante * 8;
  }

  for (let i = 1; i <= 10; i++) {
    if (response["bordarecheada" + i] == "catupiry") {
      valor += 10;
    } else if (response["bordarecheada" + i] == "cheddar") {
      valor += 10;
    } else if (response["bordarecheada" + i] == "chocolate") {
      valor += 12;
    }

    if (response["sabor" + i] != null) {
      const resultado = await encontrarObjetos(response["sabor" + i]);
      console.log(resultado);
      if (resultado.length == 1) {
        if (response["tamanho" + i] == "grande") {
          valor += resultado[0].grande;
        }

        if (response["tamanho" + i] == "média") {
          valor += resultado[0].media;
        }
      }

      if (resultado.length == 2) {
        const maiorValorSabor = Math.max(
          resultado[0].grande,
          resultado[1].grande
        );
        if (response["tamanho" + i] == "grande") {
          valor += maiorValorSabor;
        } else if (response["tamanho" + i] == "média") {
          valor += resultado[0].media;
        }
        // if (response["tamanho" + i] == "grande") {
        //   if (resultado[i].grande > maiorValor) {
        //     maiorValor = resultado[i].grande;
        //     valor += maiorValor;
        //   }
        // }

        // if (response["tamanho" + i] == "média") {
        //   if (resultado[i].media > maiorValor) {
        //     maiorValor = resultado[i].media;
        //     valor += maiorValor;
        //   }
        // }
      }
      // if (resultado.length == 2) {
      //   if (response["tamanho" + i] == "grande") {
      //     if (resultado[0].grande > maiorValor) {
      //       maiorValor = resultado[0].grande;
      //       valor += maiorValor;
      //     }
      //     if (resultado[1].grande > maiorValor) {
      //       maiorValor = resultado[1].grande;
      //       valor += maiorValor;
      //     }
      //   }

      //   if (response["tamanho" + i] == "média") {
      //     if (resultado[0].media > maiorValor) {
      //       maiorValor = resultado[0].media;
      //       valor += maiorValor;
      //     }
      //     if (resultado[1].media > maiorValor) {
      //       maiorValor = resultado[1].media;
      //       valor += maiorValor;
      //     }
      //   }
      // }
    }
  }
  return valor;
}

module.exports = { somarValorTotal };
