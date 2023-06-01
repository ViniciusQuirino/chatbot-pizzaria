const { Requests } = require("./requests");
const { IA } = require("./chatgpt");

async function somarValorTotal(response, msg, client) {
  async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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
      // await delay(i * 10000); // Delay 10 seconds for each iteration
      if (i > 1) {
        await delay(i * 3000);
      }
      const retorno = await IA(response["sabor" + i]);

      const resultadoRecortado = retorno.substring(
        retorno.indexOf("["),
        retorno.indexOf("]") + 1
      );

      console.log(resultadoRecortado);

      if (response["bordarecheada" + i] == "catupiry") {
        valor += 10;
      } else if (response["bordarecheada" + i] == "cheddar") {
        valor += 10;
      } else if (response["bordarecheada" + i] == "chocolate") {
        valor += 12;
      }

      const arrayClone = Array.from(JSON.parse(resultadoRecortado));

      if (response["tamanho" + i] == "média") {
        if (arrayClone.length == 1) {
          valor += arrayClone[0].media;
          client.sendMessage(
            msg.from,
            `O valor total do pedido foi de: R$ ${valor},00`
          );
        }
      }

      if (response["tamanho" + i] == "grande") {
        if (arrayClone.length == 2) {
          const startIndex = resultadoRecortado.indexOf("grande:") + 8;
          const endIndex = resultadoRecortado.indexOf(",", startIndex);

          let result = resultadoRecortado.substring(startIndex, endIndex);
          valor += +result;
          console.log("valor =", valor);
          client.sendMessage(msg.from, `Valor total: *R$ ${valor},00*`);
          return valor;
        }
      }
    }
  }
}

module.exports = { somarValorTotal };
