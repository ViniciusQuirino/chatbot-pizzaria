const URL_CHATBOT = "http://localhost:7005";
const axios = require("axios");
const { Requests } = require("./requests");

const cardapio = async (from) => {
  const date = new Date();
  const dia = date.getDay();

  if (dia <= 4) {
    await axios.post(`${URL_CHATBOT}/send-media`, {
      number: from,
      caption: "Promoções",
      file: "https://i.ibb.co/8gNRs4w/promocoes.jpg",
    });
    // Cardápio 1
    await axios.post(`${URL_CHATBOT}/send-media`, {
      number: from,
      caption: "",
      file: "https://i.ibb.co/yV295fx/cardapio-1.jpg",
    });
    // Cardápio 2
    await axios.post(`${URL_CHATBOT}/send-media`, {
      number: from,
      caption: "",
      file: "https://i.ibb.co/j8VWMjs/cardapio-2.jpg",
    });
  }

  if (dia >= 5) {
    // Cardápio 1
    await axios.post(`${URL_CHATBOT}/send-media`, {
      number: from,
      caption: "",
      file: "https://i.ibb.co/yV295fx/cardapio-1.jpg",
    });
    // Cardápio 2
    await axios.post(`${URL_CHATBOT}/send-media`, {
      number: from,
      caption: "",
      file: "https://i.ibb.co/j8VWMjs/cardapio-2.jpg",
    });
  }
};

const gostouDoNossoCardapio = async (from, client) => {
  client.sendMessage(
    from,
    `Gostou do nosso cardápio ? 😃

Quantas pizzas você vai querer ? Digite *apenas o numero.*`
  );
};

const querQueEntregue = async (from, client) => {
  client.sendMessage(
    from,
    `Blzaa 😃
      
Você quer que *entregue* ?

Valores:
Dentro de igaraçu: 7,00 reais
Igaraçu x Barra: 9,00 reais

⬇️ Escolha uma das opções abaixo digitando apenas o numero.

*1* - Sim, quero que entregue.
*2* - Não, vou ir buscar.`
  );
};

const desejaConfirmarOPedido = async (from, client) => {
  client.sendMessage(
    from,
    `Todas as informações do pedido está correta, deseja confirmar ?

⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*

*1* - Sim, confirmar.
*2* - Não, tem coisa errada.`
  );
};

const desejaAlgoParaBeber = async (from, client) => {
  client.sendMessage(
    from,
    `Ok, você deseja algo para beber ?

⬇️ Escolha uma das opções abaixo digitante apenas o numero.

*1* - Não quero.
*2* - Coca-Cola 2 Litros R$ 14,00
*3* - Conquista Guaraná 2 Litros R$ 8,00`
  );
  Requests.atualizarEtapa(msg.from, { etapa: "g" });
};

const sabor = async (from, client, response) => {
  const ordinal = obterRepresentacaoOrdinal(response.loop);

  client.sendMessage(
    msg.from,
    `Blzaa, agora me conte, qual é o *sabor da ${ordinal} PIZZA ?*

Atenção, apenas o *sabor da ${ordinal} PIZZA* 🍕`
  );

  const obj = criarObjetoTelefone(msg.from, response.qnt);

  Requests.atualizarPedido(obj);
  Requests.atualizarEtapa(msg.from, { etapa: "2" });
};

function verificarNumero(mensagem) {
  // Remove todos os caracteres que não sejam números da mensagem
  let numeros = mensagem.replace(/\D/g, "");

  // Retorna apenas o número encontrado na mensagem
  return numeros;
}

function obterRepresentacaoOrdinal(numero) {
  switch (numero) {
    case 1:
      return "PRIMEIRA";
    case 2:
      return "SEGUNDA";
    case 3:
      return "TERCEIRA";
    case 4:
      return "QUARTA";
    case 5:
      return "QUINTA";
    case 6:
      return "SEXTA";
    case 7:
      return "SÉTIMA";
    case 8:
      return "OITAVA";
    case 9:
      return "NONA";
    case 10:
      return "DÉCIMA";
  }
}

function criarObjetoTelefone(from, quantidade) {
  var objeto = {
    telefone: from,
  };

  for (var i = 1; i <= quantidade; i++) {
    objeto["tamanho" + i] = "grande";
  }

  return objeto;
}
function criarObjetoTamanho(from, numero, message) {
  var objeto = {
    telefone: from,
  };

  if (numero >= 0 && numero <= 10) {
    var propriedadeSabor = "tamanho" + numero;
    objeto[propriedadeSabor] = message;
  }

  return objeto;
}

function criarObjetoSabor(from, numero, message) {
  var objeto = {
    telefone: from,
  };

  if (numero >= 0 && numero <= 10) {
    var propriedadeSabor = "sabor" + numero;
    objeto[propriedadeSabor] = message;
  }

  return objeto;
}

function criarObjetoObs(from, numero, message) {
  var objeto = {
    telefone: from,
  };

  if (numero >= 0 && numero <= 10) {
    var propriedadeSabor = "obs" + numero;
    objeto[propriedadeSabor] = message;
  }

  return objeto;
}

function criarObjetoBordaRecheada(from, numero, message) {
  var objeto = {
    telefone: from,
    b: "loop",
  };

  if (numero >= 0 && numero <= 10) {
    var propriedadeSabor = "bordarecheada" + numero;
    objeto[propriedadeSabor] = message;
  }

  return objeto;
}

module.exports = {
  cardapio,
  gostouDoNossoCardapio,
  querQueEntregue,
  verificarNumero,
  desejaConfirmarOPedido,
  desejaAlgoParaBeber,
  sabor,
  obterRepresentacaoOrdinal,
  criarObjetoTelefone,
  criarObjetoTamanho,
  criarObjetoSabor,
  criarObjetoObs,
  criarObjetoBordaRecheada,
};
