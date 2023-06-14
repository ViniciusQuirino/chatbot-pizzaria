const URL_CHATBOT = "https://chatbot-pizzaria.up.railway.app";
// const URL_CHATBOT = "http://localhost:7005";
const axios = require("axios");
const { Requests } = require("./requests");
const Fuse = require("fuse.js");
const CronJob = require("cron").CronJob;

const cardapio = async (from, dia) => {
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

function cronJob() {
  const date = new Date();
  const h = date.getHours();
  const encerrarAtendimento = new CronJob("0 * * * *", async () => {
    if (h >= 17 && h <= 23) {
      Requests.encerrarAtendimento();
    }
  });
  const mudarValorDaEntregaSegunda = new CronJob("0 1 * * 1", async () => {
    Requests.atualizarProdutos(22, { valor: 0 });
  });

  const mudarValorDaEntregaSexta = new CronJob("0 1 * * 5", async () => {
    Requests.atualizarProdutos(22, { valor: 7 });
  });

  const ativarChatbot = new CronJob("0 */2 * * *", async () => {
    Requests.ativarChatbot();
  });

  encerrarAtendimento.start();
  mudarValorDaEntregaSegunda.start();
  mudarValorDaEntregaSexta.start();
  ativarChatbot.start();
}

const gostouDoNossoCardapio = async (from, client) => {
  client.sendMessage(
    from,
    `Gostou do nosso cardápio ? 😃

Quantas pizzas você vai querer ? Digite *apenas o NUMERO.*`
  );
};

const querQueEntregue = async (from, client, response) => {
  client.sendMessage(
    from,
    `Ok, você quer que *entregue* ?

Valores:
Igaraçu: ${
      response[2].valor == 0 ? "*GRATIS*" : `${response[2].valor},00 reais`
    }
Igaraçu x Barra: ${
      response[1].valor == 0 ? "*GRATIS*" : `${response[1].valor},00 reais`
    }

*1* - Sim, quero que entregue.
*2* - Não, vou ir buscar.`
  );
};

const desejaConfirmarOPedido = async (from, client) => {
  client.sendMessage(
    from,
    `Todas as informações do pedido está correta, deseja confirmar ?

*1* - Sim, confirmar.
*2* - Não, tem coisa errada.`
  );
};

const desejaAlgoParaBeber = async (from, client) => {
  client.sendMessage(
    from,
    `Ok, você deseja algo para beber ? 🥤

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

*1 - Grande (8 pedaços) 🍕*
*2 - Média (6 pedaços) 🍕*`
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

  const telefone = message.split("/");
  const temBarra = message.includes("/");

  if (telefone[0] == "desativar" && temBarra) {
    try {
      await Requests.atualizarEtapa(`55${telefone[1]}@c.us`, {
        ativado: false,
        ativado2: false,
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

  const telefone = message.split("/");
  const temBarra = message.includes("/");

  if (telefone[0] == "ativar" && temBarra) {
    try {
      await Requests.atualizarEtapa(`55${telefone[1]}@c.us`, {
        ativado: true,
        ativado2: true,
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

  const tempo = message.split("/");
  const temBarra = message.includes("/");

  if (tempo[0] == "entrega" && temBarra) {
    await Requests.atualizarTempo({ tempoentrega: tempo[1] });

    client.sendMessage(
      msg.from,
      `Tempo de entrega atualizado para: ${tempo[1]}`
    );
  }

  if (tempo[0] == "retirar" && temBarra) {
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
      if (dados.nome != undefined) {
        texto += `
*____________________________*
*Id:* ${dados.id}
*Nome:* ${dados.nome}
*Média:* R$ ${dados.media},00
*Grande:* R$ ${dados.grande},00`;
      }
    }
    client.sendMessage(msg.from, texto);
  }
}
async function listarProdutos(msg, client) {
  let message = msg.body.toLowerCase();
  let listar = message.includes("listar/produtos");

  if (listar) {
    const response = await Requests.listarProdutoss();
    let texto = "";

    for (let dados of response) {
      if (dados.refri != null) {
        texto += `
*____________________________*
*Id:* ${dados.idd}
*Refrigerante:* ${dados.refri}
*Valor:* R$ ${dados.valor},00`;
      }

      if (dados.borda != null) {
        texto += `
*____________________________*
*Id:* ${dados.idd}
*Borda:* ${dados.borda}
*Valor:* R$ ${dados.valor},00`;
      }

      if (dados.ingredientes != null) {
        texto += `
*____________________________*
*Id:* ${dados.idd}
*Ingrediente:* ${dados.ingredientes}
*Valor:* R$ ${dados.valor},00`;
      }

      if (dados.entrega != null) {
        texto += `
*____________________________*
*Id:* ${dados.idd}
*Entrega:* ${dados.entrega}
*Valor:* R$ ${dados.valor},00`;
      }
    }
    client.sendMessage(msg.from, texto);
  }
}

function voltar(msg, client) {
  const message = msg.body.toLowerCase();

  if (message == "voltar") {
    Requests.atualizarEtapa(msg.from, {
      etapa: "c",
    });
    client.sendMessage(msg.from, "Ok, errar é humano e está tudo bem 😄");

    client.sendMessage(
      msg.from,
      "Voltamos para o início para que possa refazer seu pedido."
    );

    client.sendMessage(
      msg.from,
      "Quantas pizzas você vai querer ? Digite *apenas o NUMERO.*"
    );
  }
}

async function dificuldade(msg, client) {
  client.sendMessage(
    msg.from,
    "⬇️ Escolha uma das opções abaixo digitando *apenas o NUMERO.*"
  );

  const response = await Requests.atualizarEtapa(msg.from, {
    problema: "e",
  });

  if (response.problema == 3) {
    // numeroDeTelefone;
    client.sendMessage(
      "5514998908820@c.us",
      `Tem um cliente com dificuldade para usar o chatbot, por favor ajude ele!
Numero do telefone abaixo:`
    );
    client.sendMessage("5514998908820@c.us", `${msg.from.slice(2, 13)}`);
  }

  return response;
}

async function encontrarObjetos(frase, dados) {
  const expressao = /1\/2/;
  const contemOcorrencia = expressao.test(frase);

  if (frase === "alho e tomate") {
    let obj = dados.find(function (pizza) {
      return pizza.nome === "alho e tomate";
    });
    return [obj];
  }

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
    11: "batata palha",
    12: "ovo",
    13: "parmesão",
    14: "provolone",
    15: "bacon cubos",
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

function calcularValorIngredientes(ingredientes, dados) {
  const Bacon = dados.find((objeto) => objeto.ingredientes === "bacon");
  const Milho = dados.find((objeto) => objeto.ingredientes === "milho");
  const Catupiry = dados.find((objeto) => objeto.ingredientes === "catupiry");
  const Cheddar = dados.find((objeto) => objeto.ingredientes === "cheddar");
  const Cebola = dados.find((objeto) => objeto.ingredientes === "cebola");
  const Tomate = dados.find((objeto) => objeto.ingredientes === "tomate");
  const Mussarela = dados.find((objeto) => objeto.ingredientes === "mussarela");
  const Calabresa = dados.find((objeto) => objeto.ingredientes === "calabresa");
  const Frango = dados.find((objeto) => objeto.ingredientes === "frango");
  const Presunto = dados.find((objeto) => objeto.ingredientes === "presunto");
  const Batata = dados.find((objeto) => objeto.ingredientes === "batata palha");
  const Ovo = dados.find((objeto) => objeto.ingredientes === "ovo");
  const Parmesão = dados.find((objeto) => objeto.ingredientes === "parmesão");
  const Provolone = dados.find((objeto) => objeto.ingredientes === "provolone");
  const BaconCubos = dados.find(
    (objeto) => objeto.ingredientes === "bacon cubos"
  );

  const precos = {
    1: Bacon.valor, // Bacon
    2: Milho.valor, // Milho
    3: Catupiry.valor, // Catupiry
    4: Cheddar.valor, // Cheddar
    5: Cebola.valor, // Cebola
    6: Tomate.valor, // Tomate
    7: Mussarela.valor, // Mussarela
    8: Calabresa.valor, // Calabresa
    9: Frango.valor, // Frango
    110: Presunto.valor, // Presunto
    11: Batata.valor, // Batata Palha
    12: Ovo.valor, // Ovo
    13: Parmesão.valor, // Parmesão
    14: Provolone.valor, // Provolone
    15: BaconCubos.valor, // Bacon Cubos
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
  listarProdutos,
  melhorarFrase,
  encontrarObjetos,
  audio,
  dificuldade,
  desativarchatbot,
  ativarchatbot,
  tempo,
  cronJob,
  voltar,
  interpretarIngredientes,
  calcularValorIngredientes,
};
