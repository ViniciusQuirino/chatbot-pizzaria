const { Requests } = require("./requests");
const {
  criarObjetoTelefone,
  obterRepresentacaoOrdinal,
  criarObjetoSabor,
  criarObjetoBordaRecheada,
  criarObjetoObs,
  desejaAlgoParaBeber,
  sabor,
} = require("./scripts");
const { removerAcentos } = require("./atualizar.pizza");
const { corrigirPalavrasParecidas } = require("./corrigir.palavras");

async function maisDeUma(recuperarEtapa, msg, client) {
  const response = await Requests.recuperarPedido(msg.from);
  if (recuperarEtapa.etapa == "1") {
    const ordinal = obterRepresentacaoOrdinal(response.loop);
    if (msg.body == "1") {
      client.sendMessage(
        msg.from,
        `Qual é o *sabor da ${ordinal} PIZZA ?*

Atenção, apenas o *sabor da ${ordinal} PIZZA* 🍕`
      );

      const obj = criarObjetoTelefone(msg.from, response.qnt);

      Requests.atualizarPedido(obj);
      Requests.atualizarEtapa(msg.from, { etapa: "2" });
    }
    if (msg.body == "2") {
      client.sendMessage(
        msg.from,
        `Qual é o *tamanho da ${ordinal} PIZZA ?*

⬇️ Escolha uma das opções abaixo digitante apenas o numero.

*1* - Grande 🍕
*2* - Média 🍕`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "20" });
    }
  }

  if (recuperarEtapa.etapa == "2") {
    const ordinal = obterRepresentacaoOrdinal(response.loop);
    client.sendMessage(
      msg.from,
      `*${ordinal} PIZZA:*
Há algum ingrediente que você gostaria de retirar ou adicionar ?

Caso deseje fazer alguma alteração, por favor, escreva o ingrediente que você gostaria de acrescentar ou remover.

⬇️ Se preferir manter a receita original, basta digitar o número 1.

1 - Não quero adicionar e retirar nenhum ingrediente.`
    );
    var message = msg.body.replace(/1\/2|meia|meio/g, "1/2");
    const retorno = removerAcentos(message);
    const frasePronta = corrigirPalavrasParecidas(retorno);
    const sabor = criarObjetoSabor(msg.from, response.loop, frasePronta);
    Requests.atualizarEtapa(msg.from, { etapa: "3" });
    Requests.atualizarPedido(sabor);
  }

  if (recuperarEtapa.etapa == "3") {
    const ordinal = obterRepresentacaoOrdinal(response.loop);
    client.sendMessage(
      msg.from,
      `*${ordinal} PIZZA:*
Quer adicionar borda recheada ?

⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*

1 - Não quero
2 - Catupiry R$ 10,00
3 - Cheddar R$ 10,00
4 - Chocolate R$ 12,00`
    );

    if (msg.body == "1") {
      Requests.atualizarEtapa(msg.from, { etapa: "4" });
    } else if (msg.body != "1") {
      const obs = criarObjetoObs(msg.from, response.loop, msg.body);
      Requests.atualizarEtapa(msg.from, { etapa: "4" });
      Requests.atualizarPedido(obs);
    }
  }

  if (recuperarEtapa.etapa == "4") {
    if (msg.body == "1") {
      const atualizar = await Requests.atualizarPedido({
        telefone: msg.from,
        b: "loop",
      });
      if (atualizar.qnt < atualizar.loop + "") {
        desejaAlgoParaBeber(msg.from, client);
        Requests.atualizarEtapa(msg.from, { etapa: "g" });
      } else {
        sabor(msg.from, client, atualizar);
      }
    }
    if (msg.body == "2") {
      const borda = criarObjetoBordaRecheada(
        msg.from,
        response.loop,
        "catupiry"
      );

      const atualizar = await Requests.atualizarPedido(borda);
      if (atualizar.qnt < atualizar.loop + "") {
        desejaAlgoParaBeber(msg.from, client);
        Requests.atualizarEtapa(msg.from, { etapa: "g" });
      } else {
        sabor(msg.from, client, atualizar);
      }
    }
    if (msg.body == "3") {
      const borda = criarObjetoBordaRecheada(
        msg.from,
        response.loop,
        "cheddar"
      );
      const atualizar = await Requests.atualizarPedido(borda);
      if (atualizar.qnt < atualizar.loop + "") {
        desejaAlgoParaBeber(msg.from, client);
        Requests.atualizarEtapa(msg.from, { etapa: "g" });
      } else {
        sabor(msg.from, client, atualizar);
      }
    }
    if (msg.body == "4") {
      const borda = criarObjetoBordaRecheada(
        msg.from,
        response.loop,
        "chocolate"
      );
      const atualizar = await Requests.atualizarPedido(borda);
      if (atualizar.qnt < atualizar.loop + "") {
        desejaAlgoParaBeber(msg.from, client);
        Requests.atualizarEtapa(msg.from, { etapa: "g" });
      } else {
        sabor(msg.from, client, atualizar);
      }
    }
    if (
      msg.body != "1" &&
      msg.body != "2" &&
      msg.body != "3" &&
      msg.body != "4"
    ) {
      client.sendMessage(
        msg.from,
        `Atenção ⚠️
  Quer adicionar borda recheada ?

  ⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*

  *1* - Não quero
  *2* - Catupiry R$ 10,00
  *3* - Cheddar R$ 10,00
  *4* - Chocolate R$ 12,00`
      );
    }
  }
}

module.exports = { maisDeUma };
