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
  voltar,
} = require("./scripts");
const { removerAcentos } = require("./atualizar.pizza");
const { corrigirPalavrasParecidas } = require("./corrigir.palavras");
const { corrigirFrase } = require("./caso.especifico");
const { ingredientes } = require("./ingredientes");
const { dados } = require("./corrigir.palavras");
const { removerPalavras } = require("./remover.palavras");

async function grandeEMedia(recuperarEtapa, msg, client) {
  const response = await Requests.recuperarPedido(msg.from);
  let ordinal = "";
  if (response != null) {
    ordinal = obterRepresentacaoOrdinal(response.loop);
  }

  if (recuperarEtapa.etapa == "20") {
    voltar(msg, client);
    if (msg.body == "1" || msg.body == "2") {
      client.sendMessage(
        msg.from,
        `Qual é o *sabor da ${ordinal} PIZZA ?*
            
Atenção, apenas o *sabor da ${ordinal} PIZZA* 🍕`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "21" });
    }
    if (msg.body == "1") {
      const obj = criarObjetoTamanho(msg.from, response.loop, "grande");
      Requests.atualizarPedido(obj);
    } else if (msg.body == "2") {
      const obj = criarObjetoTamanho(msg.from, response.loop, "média");
      Requests.atualizarPedido(obj);
    } else if (msg.body != "1" && msg.body != "2" && msg.body != "voltar") {
      client.sendMessage(
        msg.from,
        `Atenção ⚠️

*1 - Grande (8 pedaços) 🍕*
*2 - Média (6 pedaços) 🍕*`
      );
    }
  }

  if (recuperarEtapa.etapa == "21") {
    voltar(msg, client);
    let result = msg.body.replace(/1\/2|meia|meio/g, "");
    result = result.replace(/1\/2|meia|meio/g, "1/2");
    result = result.replace(/mais bacon/g, "");
    result = result.replace(/brocolis com bacon/g, "brocolis");
    result = result.replace(/brocolis com bacon/g, "brocolis");
    result = result.replace(/brocolis c bacon/g, "brocolis");
    result = result.replace(/brocolis c\/ bacon/g, "brocolis");
    result = result.replace(/\//g, " ");
    result = result.replace(/\(.*?\)/g, "").replace(/(['"])(.*?)\1/g, "");
    const retorno = removerAcentos(result);

    let variavelum = true;
    let variaveldois = true;
    let frase = corrigirPalavrasParecidas(retorno, variavelum, variaveldois);

    const frasePronta = corrigirFrase(frase);

    variavelum = true;
    variaveldois = true;
    frase = corrigirPalavrasParecidas(frasePronta, variavelum, variaveldois);

    frase = removerPalavras(frase);

    const ocorrencias = (frase.match(/1\/2/g) || []).length;
    const encontrar = await encontrarObjetos(frase, dados);

    const sabor = criarObjetoSabor(msg.from, response.loop, frase);

    console.log(frase);
    console.log(encontrar);

    if (
      (encontrar[0] && !ocorrencias && msg.body != "voltar") ||
      (encontrar[0] && encontrar[1] && ocorrencias && msg.body != "voltar")
    ) {
      client.sendMessage(
        msg.from,
        `*${ordinal} PIZZA:*
Tem ingrediente que você gostaria de *retirar ou adicionar ?*
  
Caso deseje remover algum ingrediente, escreva o ingrediente que você gostaria de retirar.

*Exemplo:* quero retirar a cebola.

*1* - Não quero adicionar e retirar nenhum ingrediente.
*2* - Acrescentar ingrediente`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "22" });
      Requests.atualizarPedido(sabor);
    } else if (encontrar.length == 0 && msg.body != "voltar" && !ocorrencias) {
      client.sendMessage(
        msg.from,
        `Não encontrei nenhuma pizza com esse nome, por favor digite corretamente *APENAS* o nome da pizza!
        
*Exemplo:* frango com catupiry.
*Exemplo:* meia atum especial e meia bacon.

Digite *APENAS* o nome da pizza, *nas próximas etapas* vamos perguntar se deseja adicionar ou retirar algum ingrediente, e até mesmo se quer adicionar borda. 😋`
      );

      const response = await Requests.atualizarEtapa(msg.from, {
        problema: "e",
      });

      if (response.problema == 2) {
        // numeroDeTelefone;
        client.sendMessage(
          "5514998908820@c.us",
          `Tem um cliente com dificuldade para usar o chatbot, por favor ajude ele!
Numero do telefone abaixo:`
        );
        client.sendMessage("5514998908820@c.us", `${msg.from.slice(2, 13)}`);
      }
    } else if (
      ocorrencias != encontrar.length &&
      ocorrencias &&
      msg.body != "voltar"
    ) {
      client.sendMessage(
        msg.from,
        `Não encontrei as pizzas que deseja com esse nome, por favor digite corretamente *APENAS* o nome da pizza!
        
*Exemplo:* frango com catupiry.
*Exemplo:* meia atum especial e meia bacon.

Digite *APENAS* o nome da pizza, *nas próximas etapas* vamos perguntar se deseja adicionar ou retirar algum ingrediente, e até mesmo se quer adicionar borda. 😋`
      );

      const response = await Requests.atualizarEtapa(msg.from, {
        problema: "e",
      });

      if (response.problema == 2) {
        // numeroDeTelefone;
        client.sendMessage(
          "5514998908820@c.us",
          `Tem um cliente com dificuldade para usar o chatbot, por favor ajude ele!
Numero do telefone abaixo:`
        );
        client.sendMessage("5514998908820@c.us", `${msg.from.slice(2, 13)}`);
      }
    }
  }
  // ----------------------------------------------------------------

  if (recuperarEtapa.etapa == "22") {
    voltar(msg, client);
    let message = msg.body.toLowerCase();
    const retirar = message.split("/");
    const temBarra = message.includes("/");

    if (retirar[0] == "retirar" && !temBarra && msg.body != "voltar") {
      client.sendMessage(
        msg.from,
        `Qual ingrediente você gostaria de retirar ?`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "22" });
    }

    if (msg.body == "1") {
      client.sendMessage(
        msg.from,
        `*${ordinal} PIZZA:*
Quer adicionar borda recheada ?

1 - Não quero
2 - Catupiry R$ 10,00
3 - Cheddar R$ 10,00
4 - Chocolate R$ 12,00`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "23" });
    } else if (msg.body == "2") {
      client.sendMessage(
        msg.from,
        `*${ordinal} PIZZA:*
Ingredientes para acrescentar:

*0* - Voltar
        
*1* - Bacon R$ 8,00
*2* - Milho R$ 5,00
*3* - Catupiry R$ 7,00
*4* - Cheddar R$ 7,00
*5* - Cebola R$ 2,00
*6* - Tomate R$ 2,00
*7* - Mussarela R$ 10,00
*8* - Calabresa R$ 8,00
*9* - Frango R$ 8,00
*10* - Presunto R$ 8,00
*11* - Batata Palha R$ 6,00
*12* - Ovo R$ 3,00
*13* - Parmesão R$ 10,00
*14* - Provolone R$ 12,00
*15* - Bacon Cubos R$ 8,00`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "ing" });
    } else if (
      msg.body != "1" &&
      msg.body != "2" &&
      msg.body != "voltar" &&
      retirar[0] != "retirar"
    ) {
      client.sendMessage(
        msg.from,
        `*${ordinal} PIZZA:*
Quer adicionar *borda recheada* ?
 
*1* - Não quero
*2* - Catupiry R$ 10,00
*3* - Cheddar R$ 10,00
*4* - Chocolate R$ 12,00`
      );

      const obs = criarObjetoObs(msg.from, response.loop, msg.body);
      Requests.atualizarPedido(obs);

      Requests.atualizarEtapa(msg.from, { etapa: "23" });
    }
  }

  // -----------------------------------------------
  ingredientes(msg, client, recuperarEtapa);
  // -----------------------------------------------

  if (recuperarEtapa.etapa == "23") {
    voltar(msg, client);
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
      msg.body != "4" &&
      msg.body != "voltar"
    ) {
      dificuldade(msg, client);
      client.sendMessage(
        msg.from,
        `Quer adicionar borda recheada ?

*1* - Não quero
*2* - Catupiry R$ 10,00
*3* - Cheddar R$ 10,00
*4* - Chocolate R$ 12,00`
      );
    }
  }
}

module.exports = { grandeEMedia };
