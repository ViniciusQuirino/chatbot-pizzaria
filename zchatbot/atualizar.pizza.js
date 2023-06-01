const { Requests } = require("./requests");

function removerAcentos(frase) {
  const mapaAcentosHex = {
    a: /[\xE0-\xE6]/g,
    e: /[\xE8-\xEB]/g,
    i: /[\xEC-\xEF]/g,
    o: /[\xF2-\xF6]/g,
    u: /[\xF9-\xFC]/g,
    c: /\xE7/g,
    n: /\xF1/g,
  };

  let fraseSemAcentos = frase.toLowerCase();
  for (let letra in mapaAcentosHex) {
    const expressaoRegular = mapaAcentosHex[letra];
    fraseSemAcentos = fraseSemAcentos.replace(expressaoRegular, letra);
  }

  return fraseSemAcentos;
}

async function atualizarPizza(msg, client) {
  let message = msg.body.toLowerCase();
  const retorno = removerAcentos(message);
  let arr = retorno.split("/");
  if (arr[1] == "média" || arr[1] == "grande") {
    if (arr[1] == "média" && Number.isInteger(+arr[2].slice(0, 2))) {
      try {
        await Requests.atualizarPizzas(arr[0], { media: arr[2].slice(0, 2) });
        client.sendMessage(
          msg.from,
          `Pizza média com o id: ${arr[0]} atualizada com sucesso`
        );
      } catch (err) {
        client.sendMessage(msg.from, `Esse id não existe`);
      }
    } else if (arr[1] == "grande" && Number.isInteger(+arr[2].slice(0, 2))) {
      try {
        await Requests.atualizarPizzas(arr[0], { grande: arr[2].slice(0, 2) });
        client.sendMessage(
          msg.from,
          `Pizza grande com o id: ${arr[0]} atualizada com sucesso`
        );
      } catch (err) {
        client.sendMessage(msg.from, `Esse id não existe`);
      }
    } else if (!Number.isInteger(+arr[2].slice(0, 2))) {
      client.sendMessage(
        msg.from,
        `Depois da ultima / coloque o valor da pizza`
      );
    }
  }
}

module.exports = { atualizarPizza, removerAcentos };
