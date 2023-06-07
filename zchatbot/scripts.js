const URL_CHATBOT = "http://localhost:7005";
const axios = require("axios");
const { Requests } = require("./requests");
const { numeroDeTelefone } = require("./pedido");
const Fuse = require("fuse.js");

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
};

const audio = (from, client) => {
  client.sendMessage(
    from,
    `*Desculpe, sou uma assistente virtual e não consigo compreender áudios.*

Siga o passo a passo para que eu possa realizar seu pedido`
  );
};

const sabor = async (from, client, response) => {
  const ordinal = obterRepresentacaoOrdinal(response.loop);

  client.sendMessage(
    from,
    `Qual é o *sabor da ${ordinal} PIZZA ?*

Atenção, apenas o *sabor da ${ordinal} PIZZA* 🍕`
  );

  Requests.atualizarEtapa(from, { etapa: "2" });
};

const tamanho = async (from, client, response) => {
  const ordinal = obterRepresentacaoOrdinal(response.loop);

  client.sendMessage(
    from,
    `Qual é o *tamanho da ${ordinal} PIZZA ?*

⬇️ Escolha uma das opções abaixo digitante apenas o numero.

*1* - Grande 🍕
*2* - Média 🍕`
  );
  Requests.atualizarEtapa(from, { etapa: "20" });
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

function criarObjetoIngrediente(from, numero, message, request) {
  var objeto = {
    telefone: from,
  };

  if (numero >= 0 && numero <= 10) {
    var propriedadeIngrediente = "adcingrediente" + numero;
    if (request["adcingrediente" + numero] == null) {
      objeto[propriedadeIngrediente] = message;
    } else if (request["adcingrediente" + numero] != null) {
      objeto[propriedadeIngrediente] =
        request["adcingrediente" + numero] + `-${message}`;
    }
  }

  return objeto;
}

async function desativarchatbot(msg, client) {
  let message = msg.body.toLowerCase();

  let desativar = message.slice(0, 9);
  let telefone = message.split("/");

  if (desativar == "desativar") {
    try {
      await Requests.atualizarEtapa(`55${telefone[1]}@c.us`, {
        ativado: false,
        etapa: "des",
      });
      client.sendMessage(msg.from, "Chatbot desativado.");
    } catch (error) {
      client.sendMessage(
        msg.from,
        "Não existe esse numero no banco de dados. Não se esqueça do ddd."
      );
    }
  }
}

async function ativarchatbot(msg, client) {
  let message = msg.body.toLowerCase();

  let ativar = message.slice(0, 6);
  let telefone = message.split("/");

  if (ativar == "ativar") {
    try {
      await Requests.atualizarEtapa(`55${telefone[1]}@c.us`, {
        ativado: true,
        etapa: "a",
      });
      client.sendMessage(msg.from, "Chatbot ativado.");
    } catch (error) {
      client.sendMessage(
        msg.from,
        "Não existe esse numero no banco de dados. Não se esqueça do ddd."
      );
    }
  }
}

async function tempo(msg, client) {
  let message = msg.body.toLowerCase();

  let comando = message.slice(0, 7);
  let tempo = message.split("/");

  if (comando == "entrega") {
    await Requests.atualizarTempo({ tempoentrega: tempo[1] });

    client.sendMessage(
      msg.from,
      `Tempo de entrega atualizado para: ${tempo[1]}`
    );
  }

  if (comando == "retirar") {
    await Requests.atualizarTempo({ temporetirada: tempo[1] });

    client.sendMessage(
      msg.from,
      `Tempo para retirar atualizado para: ${tempo[1]}`
    );
  }
}

async function listarPizzas(msg, client) {
  let message = msg.body.toLowerCase();
  let listar = message.includes("listar/pizzas");
  if (listar) {
    const response = await Requests.listarPizzas();
    let texto = "";

    for (let dados of response) {
      texto += `
*____________________________*
*Id:* ${dados.id}
*Nome:* ${dados.nome}
*Média:* ${dados.media},00
*Grande:* ${dados.grande},00`;
    }
    client.sendMessage(msg.from, texto);
  }
}

async function dificuldade(msg, client) {
  const response = await Requests.atualizarEtapa(msg.from, {
    problema: "e",
  });
  if (response.problema == 3) {
    client.sendMessage(
      numeroDeTelefone,
      `Tem um cliente com dificuldade para usar o chatbot, por favor ajude ele!`
    );
  }
}

async function encontrarObjetos(frase, dados) {
  const expressao = /1\/2/;
  const contemOcorrencia = expressao.test(frase);

  if (contemOcorrencia) {
    const regex = /1\/2\s(.*?)\se\s1\/2\s(.*?)$/;
    const matches = frase.match(regex);

    if (matches) {
      const sabor1 = matches[1];
      const sabor2 = matches[2];

      const options = {
        keys: ["nome"],
        threshold: -1,
      };

      const fuse = new Fuse(dados, options);

      const resultadosSabor1 = fuse.search(sabor1);
      const resultadosSabor2 = fuse.search(sabor2);

      const objetosIguais = [];

      resultadosSabor1.forEach((resultado) => {
        const objeto = resultado.item;
        objetosIguais.push(objeto);
      });

      resultadosSabor2.forEach((resultado) => {
        const objeto = resultado.item;
        objetosIguais.push(objeto);
      });

      return objetosIguais;
    } else {
      const options = {
        keys: ["nome"],
        threshold: -1, // Defina um valor de limiar adequado aqui
      };

      const fuse = new Fuse(dados, options);
      const resultados = fuse.search(frase);

      const objetosEncontrados = resultados.map((resultado) => resultado.item);
      return objetosEncontrados;
    }
  } else {
    const regex = /(.+?)\se\s(.+?)$/;
    const matches = frase.match(regex);

    if (matches) {
      const sabor1 = matches[1].trim();
      const sabor2 = matches[2].trim();

      const options = {
        keys: ["nome"],
        threshold: -1, // Defina um valor de limiar adequado aqui
      };

      const fuse = new Fuse(dados, options);

      const resultadosSabor1 = fuse.search(sabor1);
      const resultadosSabor2 = fuse.search(sabor2);

      const objetosEncontrados = resultadosSabor1
        .concat(resultadosSabor2)
        .map((resultado) => resultado.item);

      return objetosEncontrados;
    } else {
      const options = {
        keys: ["nome"],
        threshold: -1, // Defina um valor de limiar adequado aqui
      };

      const fuse = new Fuse(dados, options);
      const resultados = fuse.search(frase);

      const objetosEncontrados = resultados.map((resultado) => resultado.item);

      return objetosEncontrados;
    }
  }
}

function melhorarFrase(frase) {
  const padrao = /1\/2/g; // Expressão regular para encontrar todas as ocorrências de "1/2"

  // Verifica se há pelo menos duas ocorrências de "1/2"
  if ((frase.match(padrao) || []).length >= 2) {
    // Verifica se a segunda ocorrência de "1/2" é precedida por um "e"
    if (!/e\s1\/2/.test(frase)) {
      frase = frase.replace(padrao, (match, offset) => {
        if (offset === frase.indexOf("1/2", frase.indexOf("1/2") + 1)) {
          return "e 1/2";
        } else {
          return match;
        }
      });
    }
  }

  return frase; // Retorna a frase modificada ou a frase original se não houve alterações
}

function interpretarIngredientes(ingredientesString) {
  const ingredientes = {
    1: "bacon",
    2: "milho",
    3: "catupiry",
    4: "cheddar",
    5: "cebola",
    6: "tomate",
    7: "mussarela",
    8: "calabresa",
    9: "frango",
    10: "presunto",
    11: "batata Palha",
    12: "ovo",
    13: "parmesão",
    14: "provolone",
    15: "bacon Cubos",
  };

  const ingredientesSelecionados = ingredientesString.split("-");
  const ingredientesNomes = ingredientesSelecionados.map(
    (ingrediente) => ingredientes[ingrediente]
  );

  if (ingredientesNomes.length > 1) {
    const ultimoIngrediente = ingredientesNomes.pop();
    return ingredientesNomes.join(", ") + " e " + ultimoIngrediente;
  }

  return ingredientesNomes[0];
}

function calcularValorIngredientes(ingredientes) {
  const precos = {
    1: 8, // Bacon
    2: 5, // Milho
    3: 7, // Catupiry
    4: 7, // Cheddar
    5: 2, // Cebola
    6: 2, // Tomate
    7: 10, // Mussarela
    8: 8, // Calabresa
    9: 8, // Frango
    10: 8, // Presunto
    11: 6, // Batata Palha
    12: 3, // Ovo
    13: 10, // Parmesão
    14: 12, // Provolone
    15: 8, // Bacon Cubos
  };

  const ingredientesArray = ingredientes.split("-");

  let valorTotal = 0;
  for (let i = 0; i < ingredientesArray.length; i++) {
    const ingrediente = ingredientesArray[i];
    if (precos.hasOwnProperty(ingrediente)) {
      valorTotal += precos[ingrediente];
    }
  }

  return valorTotal;
}

module.exports = {
  cardapio,
  gostouDoNossoCardapio,
  querQueEntregue,
  verificarNumero,
  desejaConfirmarOPedido,
  desejaAlgoParaBeber,
  sabor,
  tamanho,
  obterRepresentacaoOrdinal,
  criarObjetoTelefone,
  criarObjetoTamanho,
  criarObjetoSabor,
  criarObjetoObs,
  criarObjetoBordaRecheada,
  criarObjetoIngrediente,
  listarPizzas,
  melhorarFrase,
  encontrarObjetos,
  audio,
  dificuldade,
  desativarchatbot,
  ativarchatbot,
  tempo,
  interpretarIngredientes,
  calcularValorIngredientes,
};
