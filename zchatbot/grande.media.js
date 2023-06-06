const { Requests } = require("./requests");
const {
  obterRepresentacaoOrdinal,
  criarObjetoSabor,
  criarObjetoBordaRecheada,
  criarObjetoObs,
  criarObjetoTamanho,
  desejaAlgoParaBeber,
  tamanho,
  encontrarObjetos,
  dificuldade,
} = require("./scripts");
const { removerAcentos } = require("./atualizar.pizza");
const { corrigirPalavrasParecidas } = require("./corrigir.palavras");
const { numeroDeTelefone } = require("./pedido");
const { corrigirFrase } = require("./caso.especifico");

async function grandeEMedia(recuperarEtapa, msg, client) {
  const response = await Requests.recuperarPedido(msg.from);
  const ordinal = obterRepresentacaoOrdinal(response.loop);
  if (recuperarEtapa.etapa == "20") {
    client.sendMessage(
      msg.from,
      `Qual é o *sabor da ${ordinal} PIZZA ?*
          
Atenção, apenas o *sabor da ${ordinal} PIZZA* 🍕`
    );
    Requests.atualizarEtapa(msg.from, { etapa: "21" });
    if (msg.body == "1") {
      const obj = criarObjetoTamanho(msg.from, response.loop, "grande");
      Requests.atualizarPedido(obj);
    } else if (msg.body == "2") {
      const obj = criarObjetoTamanho(msg.from, response.loop, "média");
      Requests.atualizarPedido(obj);
    }
  }

  if (recuperarEtapa.etapa == "21") {
    let result = msg.body.replace(/1\/2|meia|meio/g, "1/2");
    const retorno = removerAcentos(result);

    let variavelum = true;
    let variaveldois = true;
    let frase = corrigirPalavrasParecidas(retorno, variavelum, variaveldois);

    const frasePronta = corrigirFrase(frase);

    variavelum = true;
    variaveldois = true;
    frase = corrigirPalavrasParecidas(frasePronta, variavelum, variaveldois);

    const ocorrencias = (frase.match(/1\/2/g) || []).length;
    const encontrar = await encontrarObjetos(frase);

    console.log(ocorrencias);
    console.log(frase);
    console.log(encontrar);

    const sabor = criarObjetoSabor(msg.from, response.loop, frase);

    if (ocorrencias != encontrar.length && ocorrencias) {
      client.sendMessage(
        numeroDeTelefone,
        `*Tem um cliente que deu problema e o chatbot não vai conseguir calcular o valor total corretamente, fique atento.*`
      );
    }

    if (encontrar[0]) {
      client.sendMessage(
        msg.from,
        `*${ordinal} PIZZA:*
Há algum ingrediente que você gostaria de retirar ou adicionar ?

Caso deseje fazer alguma alteração, por favor, escreva o ingrediente que você gostaria de acrescentar ou remover.

⬇️ Se preferir manter a receita original, basta digitar o número 1.

1 - Não quero adicionar e retirar nenhum ingrediente.`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "22" });
      Requests.atualizarPedido(sabor);
    } else {
      client.sendMessage(
        msg.from,
        `Desculpa, mas não encontrei nenhuma pizza com esse nome, por favor digite corretamente o nome da pizza!`
      );
      dificuldade(msg, client);
    }
  }

  if (recuperarEtapa.etapa == "22") {
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
    Requests.atualizarEtapa(msg.from, { etapa: "23" });

    if (msg.body != "1") {
      const obs = criarObjetoObs(msg.from, response.loop, msg.body);
      Requests.atualizarPedido(obs);
    }
  }

  if (recuperarEtapa.etapa == "23") {
    if (msg.body == "1") {
      const atualizar = await Requests.atualizarPedido({
        telefone: msg.from,
        b: "loop",
      });
      if (atualizar.qnt < atualizar.loop + "") {
        desejaAlgoParaBeber(msg.from, client);
        Requests.atualizarEtapa(msg.from, { etapa: "g" });
      } else {
        tamanho(msg.from, client, atualizar);
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
        tamanho(msg.from, client, atualizar);
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
        tamanho(msg.from, client, atualizar);
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
        tamanho(msg.from, client, atualizar);
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
      dificuldade(msg, client);
    }
  }
}

module.exports = { grandeEMedia };
