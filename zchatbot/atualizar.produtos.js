const { Requests } = require("./requests");

async function atualizarProduto(msg, client) {
  let message = msg.body.toLowerCase();
  let arr = message.split("/");
  if (arr[1] == "produto") {
    if (Number.isInteger(+arr[2])) {
      try {
        await Requests.atualizarProdutos(arr[0], { valor: +arr[2] });
        client.sendMessage(
          msg.from,
          `Preço do produto com o id ${arr[0]} atualizado com sucesso!`
        );
      } catch (err) {
        client.sendMessage(msg.from, `Não existe produto com esse id.`);
      }
    }
  }
}

module.exports = { atualizarProduto };
