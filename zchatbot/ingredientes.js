const { Requests } = require("./requests");
const {
  criarObjetoIngrediente,
  dificuldade,
  obterRepresentacaoOrdinal,
  voltar,
} = require("./scripts");

const desejaAdicionarMais = async (msg, client, response, ordinal) => {
  if (response.qnt > 1) {
    client.sendMessage(
      msg.from,
      `*${ordinal} PIZZA:*
Deseja adicionar mais algum ingrediente na pizza ?
    
*1* - Sim, quero adicionar mais.
*2* - Não.`
    );
  } else if (response.qnt == 1) {
    client.sendMessage(
      msg.from,
      `Deseja adicionar mais algum ingrediente na pizza ?
    
*1* - Sim, quero adicionar mais.
*2* - Não.`
    );
  }
};

const ingredientes = async (msg, client, recuperarEtapa) => {
  const message = msg.body.toLowerCase();
  const response = await Requests.recuperarPedido(msg.from);
  let ordinal = "";
  if (response != null) {
    ordinal = obterRepresentacaoOrdinal(response.loop);
  }
  let numeros = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
  ];
  if (recuperarEtapa.etapa == "ing") {
    voltar(msg, client);
    if (numeros.includes(msg.body)) {
      desejaAdicionarMais(msg, client, response, ordinal);

      const ingrediente = criarObjetoIngrediente(
        msg.from,
        response.loop,
        msg.body,
        response
      );

      Requests.atualizarPedido(ingrediente);
      Requests.atualizarEtapa(msg.from, { etapa: "90" });
    } else if (
      !numeros.includes(msg.body) &&
      msg.body != "0" &&
      message != "voltar"
    ) {
      dificuldade(msg, client);
      client.sendMessage(
        msg.from,
        `Ingredientes para acrescentar:

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
    } else if (msg.body == "0") {
      if (response.qnt > 1) {
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
      } else if (response.qnt == 1) {
        client.sendMessage(
          msg.from,
          `Tem ingrediente que você gostaria de *retirar ou adicionar ?*
  
Caso deseje remover algum ingrediente, escreva o ingrediente que você gostaria de retirar.

*Exemplo:* quero retirar a cebola.

*1* - Não quero adicionar e retirar nenhum ingrediente.
*2* - Acrescentar ingrediente`
        );
        Requests.atualizarEtapa(msg.from, { etapa: "e" });
      }
    }
  }

  if (recuperarEtapa.etapa == "90") {
    voltar(msg, client);
    if (msg.body == "1") {
      client.sendMessage(
        msg.from,
        `Ingredientes para acrescentar:

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
    } else if (msg.body == "2") {
      let retorno = [];
      if (response["tamanho" + response.qnt] == "grande") {
        retorno = await Requests.atualizarEtapa(msg.from, { etapa: "4" });
      } else if (response["tamanho" + response.qnt] != "grande") {
        retorno = await Requests.atualizarEtapa(msg.from, { etapa: "23" });
      }

      if (response.qnt > 1) {
        client.sendMessage(
          msg.from,
          `*${ordinal} PIZZA:*
Quer adicionar *borda recheada* ?
  
*1* - Não quero
*2* - Catupiry R$ ${retorno[5].valor},00
*3* - Cheddar R$ ${retorno[6].valor},00
*4* - Chocolate R$ ${retorno[7].valor},00`
        );
      } else if (response.qnt == 1) {
        const retorno = await Requests.atualizarEtapa(msg.from, {
          etapa: "f",
        });
        client.sendMessage(
          msg.from,
          `Quer adicionar *borda recheada* ?
  
*1* - Não quero
*2* - Catupiry R$ ${retorno[5].valor},00
*3* - Cheddar R$ ${retorno[6].valor},00
*4* - Chocolate R$ ${retorno[7].valor},00`
        );
      }
    } else if (msg.body != "1" && msg.body != "2" && message != "voltar") {
      client.sendMessage(msg.from, `*Atenção* ⚠️`);
      dificuldade(msg, client);
      desejaAdicionarMais(msg, client, response, ordinal);
    }
  }
};

module.exports = { ingredientes };
