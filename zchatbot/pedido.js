// const numeroDeTelefone = "5514998908820@c.us";
const { Requests } = require("./requests");
const {
  cardapio,
  gostouDoNossoCardapio,
  querQueEntregue,
  verificarNumero,
  desejaConfirmarOPedido,
  desejaAlgoParaBeber,
  encontrarObjetos,
  dificuldade,
  voltar,
} = require("./scripts");
const { gerarTemplateString } = require("./informacoes.pedido");
const { somarValorTotal } = require("./valor.total");
const { removerAcentos } = require("./atualizar.pizza");
const { corrigirPalavrasParecidas } = require("./corrigir.palavras");
const { corrigirFrase } = require("./caso.especifico");
const { ingredientes } = require("./ingredientes");
const { dados } = require("./corrigir.palavras");
const { removerPalavras } = require("./remover.palavras");

async function pedidos(recuperarEtapa, msg, client) {
  const message = msg.body.toLowerCase();
  if (recuperarEtapa.etapa == "a") {
    const response = await Requests.recuperarTempo();
    client.sendMessage(
      msg.from,
      `Olá! 😃
Eu sou o *assistente virtual da Pizzas Primo Delivery* e estou aqui para te ajudar.

Tempo de entrega: ${response.tempoentrega}
Tempo p/ retirar: ${response.temporetirada}

⬇️ Escolha uma das opções abaixo digitando *apenas o NUMERO.*

*1* - Cardápio e Promoções
*2* - Fazer pedido
*3* - Redes Sociais`
    );

    client.sendMessage(
      msg.from,
      `Se em algum momento você errar na hora de fazer o pedido, basta digitar *VOLTAR*`
    );
    Requests.atualizarEtapa(msg.from, { etapa: "b" });
  }

  if (recuperarEtapa.etapa == "b") {
    const dataAtual = new Date();
    const diaSemana = dataAtual.getDay(); // 0 (Domingo) a 6 (Sábado)
    if (msg.body == "1") {
      await cardapio(msg.from, diaSemana);

      if (diaSemana >= 5) {
        client.sendMessage(
          msg.from,
          `Nossa promoção é valida apenas de *SEGUNDA A QUINTA*`
        );
      }

      gostouDoNossoCardapio(msg.from, client);
      Requests.atualizarEtapa(msg.from, { etapa: "c" });
    } else if (msg.body == "2") {
      await cardapio(msg.from, diaSemana);

      if (diaSemana >= 5) {
        client.sendMessage(
          msg.from,
          `Gostariamos de compartilhar com você que temos promoção de *SEGUNDO A QUINTA*`
        );
      }

      gostouDoNossoCardapio(msg.from, client);
      Requests.atualizarEtapa(msg.from, { etapa: "c" });
    } else if (msg.body == "3") {
      Requests.atualizarEtapa(msg.from, { etapa: "a" });

      client.sendMessage(
        msg.from,
        `https://www.instagram.com/pizzasprimodelivery/`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "a" });
    } else if (msg.body != "1" && msg.body != "2" && msg.body != "3") {
      client.sendMessage(
        msg.from,
        `Agora nosso atendimento é *AUTOMATIZADO!* Mais agilidade, respostas rápidas e um novo jeito de pedir sua pizza favorita. 😋`
      );
      dificuldade(msg, client);
      client.sendMessage(
        msg.from,
        `*1* - Cardápio e Promoções
*2* - Fazer pedido
*3* - Redes Sociais`
      );
    }
  }

  if (recuperarEtapa.etapa == "c") {
    const verificarResposta = verificarNumero(msg.body);
    if (verificarResposta) {
      const resposta = +verificarResposta;

      if (resposta == 1) {
        client.sendMessage(
          msg.from,
          `Certo, então é ${resposta} pizza.
  
Qual o *tamanho* que você quer ? Digite *apenas o NUMERO*

*1 - Grande (8 pedaços) 🍕*
*2 - Média (6 pedaços) 🍕*`
        );
        Requests.criarPedido({ telefone: msg.from, qnt: 1 });
        Requests.atualizarEtapa(msg.from, { etapa: "bord" });
      } else if (resposta >= 2 && resposta <= 10) {
        client.sendMessage(
          msg.from,
          `Certo, então são ${resposta} pizzas. Todas são *tamanho* grande ? Digite *apenas o NUMERO*
  
*1* - Sim, as ${resposta} pizzas são tamanho grande.
*2* - Não, tem pizza que vai ser tamanho médio.`
        );
        Requests.criarPedido({ telefone: msg.from, qnt: resposta });
        Requests.atualizarEtapa(msg.from, { etapa: "1" });
      } else if (resposta > 10) {
        client.sendMessage(
          msg.from,
          `*Atenção ⚠️*
*Com a nossa assistente virtual voce pode pedir 10 pizzas no máximo*
*Caso queira pedir mais que 10 pizzas chame no numero: 14998908820*`
        );
      }
    } else if (verificarResposta == "") {
      client.sendMessage(
        msg.from,
        `Agora nosso atendimento é *AUTOMATIZADO!* Mais agilidade, respostas rápidas e um novo jeito de pedir sua pizza favorita. 😋`
      );

      client.sendMessage(
        msg.from,
        `Quantas pizzas você vai querer ? Digite *apenas o NUMERO.*`
      );
    }
  }

  if (recuperarEtapa.etapa == "bord") {
    voltar(msg, client);
    if (msg.body == "1") {
      client.sendMessage(
        msg.from,
        `Qual é o *sabor* da pizza que deseja ?

Se você quiser *MEIO A MEIO*, pode informar aqui mesmo por favor 😃`
      );
      Requests.atualizarPedido({ telefone: msg.from, tamanho1: "grande" });
      Requests.atualizarEtapa(msg.from, { etapa: "d" });
    }
    if (msg.body == "2") {
      client.sendMessage(
        msg.from,
        `Qual é o *sabor* da pizza que deseja ?

Se você quiser *MEIO A MEIO*, pode informar aqui mesmo por favor 😃`
      );
      Requests.atualizarPedido({ telefone: msg.from, tamanho1: "média" });
      Requests.atualizarEtapa(msg.from, { etapa: "d" });
    }
    if (msg.body != "1" && msg.body != "2" && message != "voltar") {
      dificuldade(msg, client);
      client.sendMessage(
        msg.from,
        `*1 - Grande (8 pedaços) 🍕*
*2 - Média (6 pedaços) 🍕*`
      );
    }
  }
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  if (recuperarEtapa.etapa == "d") {
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

    let retorno = removerAcentos(result);

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

    console.log(frase);
    console.log(encontrar);

    if (
      (encontrar[0] && !ocorrencias && message != "voltar") ||
      (encontrar[0] && encontrar[1] && ocorrencias && message != "voltar")
    ) {
      client.sendMessage(
        msg.from,
        `Tem ingrediente que você gostaria de *retirar ou adicionar ?*
  
Caso deseje remover algum ingrediente, escreva o ingrediente que você gostaria de retirar.

*Exemplo:* quero retirar a cebola.

*1* - Não quero adicionar e retirar nenhum ingrediente.
*2* - Acrescentar ingrediente`
      );
      Requests.atualizarPedido({ telefone: msg.from, sabor1: frase });
      Requests.atualizarEtapa(msg.from, { etapa: "e" });
    } else if (encontrar.length == 0 && message != "voltar" && !ocorrencias) {
      client.sendMessage(
        msg.from,
        `Não encontrei nenhuma pizza com esse nome, por favor digite corretamente *APENAS* o nome da pizza!
        
*Exemplo:* frango com catupiry.
*Exemplo:* meia atum especial e meia bacon.

Por favor digite *APENAS* o nome da pizza, *nas próximas etapas* vamos perguntar se deseja adicionar ou retirar algum ingrediente, e até mesmo se quer adicionar borda. 😋`
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
      message != "voltar"
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
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  if (recuperarEtapa.etapa == "e") {
    voltar(msg, client);

    const retirar = message.split("/");
    const temBarra = message.includes("/");

    if (retirar[0] == "retirar" && !temBarra && message != "voltar") {
      client.sendMessage(
        msg.from,
        `Qual ingrediente você gostaria de retirar ?`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "e" });
    }

    if (msg.body == "1") {
      client.sendMessage(
        msg.from,
        `Quer adicionar *borda recheada* ?
  
*1* - Não quero
*2* - Catupiry R$ 10,00
*3* - Cheddar R$ 10,00
*4* - Chocolate R$ 12,00`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "f" });
    } else if (msg.body == "2") {
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
    } else if (
      msg.body != "1" &&
      msg.body != "2" &&
      message != "voltar" &&
      retirar[0] != "retirar"
    ) {
      client.sendMessage(
        msg.from,
        `Quer adicionar *borda recheada* ?
   
*1* - Não quero
*2* - Catupiry R$ 10,00
*3* - Cheddar R$ 10,00
*4* - Chocolate R$ 12,00`
      );
      Requests.atualizarPedido({ telefone: msg.from, obs1: msg.body });
      Requests.atualizarEtapa(msg.from, { etapa: "f" });
    }
  }

  // -----------------------------------------------
  ingredientes(msg, client, recuperarEtapa);
  // -----------------------------------------------

  if (recuperarEtapa.etapa == "f") {
    voltar(msg, client);
    if (msg.body == "1") {
      desejaAlgoParaBeber(msg.from, client);
      Requests.atualizarEtapa(msg.from, { etapa: "g" });
    }
    if (msg.body == "2") {
      desejaAlgoParaBeber(msg.from, client);
      Requests.atualizarPedido({
        telefone: msg.from,
        bordarecheada1: "catupiry",
      });
      Requests.atualizarEtapa(msg.from, { etapa: "g" });
    }
    if (msg.body == "3") {
      desejaAlgoParaBeber(msg.from, client);
      Requests.atualizarPedido({
        telefone: msg.from,
        bordarecheada1: "cheddar",
      });
      Requests.atualizarEtapa(msg.from, { etapa: "g" });
    }
    if (msg.body == "4") {
      desejaAlgoParaBeber(msg.from, client);
      Requests.atualizarPedido({
        telefone: msg.from,
        bordarecheada1: "chocolate",
      });
      Requests.atualizarEtapa(msg.from, { etapa: "g" });
    }
    if (
      msg.body != "1" &&
      msg.body != "2" &&
      msg.body != "3" &&
      msg.body != "4" &&
      message != "voltar"
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

  if (recuperarEtapa.etapa == "g") {
    voltar(msg, client);
    if (msg.body == "1") {
      const response = await Requests.atualizarEtapa(msg.from, {
        etapa: "ent",
      });
      querQueEntregue(msg.from, client, response);
    }

    if (msg.body == "2") {
      client.sendMessage(
        msg.from,
        `Ok, *quantas* Coca-Cola 2 Litros você vai querer ? Digite o número.`
      );

      Requests.atualizarPedido({
        telefone: msg.from,
        refrigerante: "Coca-cola 2 litros",
      });
      Requests.atualizarEtapa(msg.from, { etapa: "h" });
    }

    if (msg.body == "3") {
      client.sendMessage(
        msg.from,
        `Ok, *quantos* guaraná Conquista 2 litros você vai querer ? Digite o número.`
      );

      Requests.atualizarPedido({
        telefone: msg.from,
        refrigerante: "Conquista guaraná 2 litros",
      });
      Requests.atualizarEtapa(msg.from, { etapa: "h" });
    }
    if (
      msg.body != "1" &&
      msg.body != "2" &&
      msg.body != "3" &&
      message != "voltar"
    ) {
      dificuldade(msg, client);
      client.sendMessage(
        msg.from,
        `Você deseja algo para *beber* ? 🥤
 
*1* - Não quero.
*2* - Coca-Cola 2 Litros R$ 14,00
*3* - Conquista Guaraná 2 Litros R$ 8,00`
      );
    }
  }

  if (recuperarEtapa.etapa == "h") {
    voltar(msg, client);
    const verificarResposta = verificarNumero(msg.body);
    if (verificarResposta && message != "voltar") {
      const response = await Requests.atualizarEtapa(msg.from, {
        etapa: "ent",
      });
      querQueEntregue(msg.from, client, response);
      Requests.atualizarPedido({
        telefone: msg.from,
        qntrefrigerante: +verificarResposta,
      });
    } else if (verificarResposta == "" && message != "voltar") {
      client.sendMessage(
        msg.from,
        `*Quantos refrigerantes* você quer, digite a quantidade por favor!!!`
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
    }
  }

  if (recuperarEtapa.etapa == "ent") {
    voltar(msg, client);
    if (msg.body == "1" && message != "voltar") {
      client.sendMessage(
        msg.from,
        `⬇️ Qual é a cidade ?
  
*1* - Igaraçu do Tietê
*2* - Barra Bonita`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "i" });
    } else if (msg.body == "2" && message != "voltar") {
      client.sendMessage(
        msg.from,
        `Qual vai ser a forma de pagamento ?
  
*1* - Dinheiro
*2* - Cartão
*3* - Pix`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "k" });
    } else if (msg.body != "1" && msg.body != "2" && message != "voltar") {
      const response = await dificuldade(msg, client);
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
    }
  }

  if (recuperarEtapa.etapa == "i") {
    voltar(msg, client);
    if (msg.body == "1" || (msg.body == "2" && message != "voltar")) {
      client.sendMessage(
        msg.from,
        `⏩ Digite o seu *endereço* por favor.
  
*Nome da rua, numero*
*Exemplo*: Rua antônio manfio 1042`
      );
      if (msg.body == "1") {
        Requests.atualizarPedido({
          telefone: msg.from,
          cidade: 1,
        });
        Requests.atualizarEtapa(msg.from, { etapa: "j" });
      }

      if (msg.body == "2") {
        Requests.atualizarPedido({
          telefone: msg.from,
          cidade: 2,
        });
        Requests.atualizarEtapa(msg.from, { etapa: "j" });
      }
    } else if (msg.body != "1" && msg.body != "2" && message != "voltar") {
      dificuldade(msg, client);
      client.sendMessage(
        msg.from,
        `Qual é a cidade ?
  
*1* - Igaraçu do Tietê
*2* - Barra Bonita`
      );
    }
  }

  if (recuperarEtapa.etapa == "j") {
    voltar(msg, client);
    if (message != "voltar") {
      client.sendMessage(
        msg.from,
        `Qual vai ser a forma de pagamento ?
  
*1* - Dinheiro
*2* - Cartão
*3* - Pix`
      );
      Requests.atualizarPedido({ telefone: msg.from, endereco: msg.body });
      Requests.atualizarEtapa(msg.from, { etapa: "k" });
    }
  }

  if (recuperarEtapa.etapa == "k") {
    voltar(msg, client);
    if (msg.body == "1" && message != "voltar") {
      const response = await Requests.recuperarPedido(msg.from);
      const valor = await somarValorTotal(response);
      client.sendMessage(msg.from, `Valor total: ${valor},00`);

      client.sendMessage(
        msg.from,
        `Você precisa de troco ?

Se sim, troco para quanto ? Escreva o valor.

Se não, digite apenas o numero 1

*1* - Não preciso de troco`
      );
      Requests.atualizarPedido({
        telefone: msg.from,
        formadepagamento: "dinheiro",
      });
      Requests.atualizarEtapa(msg.from, { etapa: "l" });
    }
    if (msg.body == "2" && message != "voltar") {
      const response = await Requests.atualizarPedido({
        telefone: msg.from,
        formadepagamento: "cartão",
      });
      const valor = await somarValorTotal(response);

      gerarTemplateString(response, msg.from, client, valor);

      desejaConfirmarOPedido(msg.from, client);
      Requests.atualizarEtapa(msg.from, { etapa: "conf" });
    }
    if (msg.body == "3" && message != "voltar") {
      const response = await Requests.atualizarPedido({
        telefone: msg.from,
        formadepagamento: "pix",
      });
      const valor = await somarValorTotal(response);

      gerarTemplateString(response, msg.from, client, valor);

      desejaConfirmarOPedido(msg.from, client);
      Requests.atualizarEtapa(msg.from, { etapa: "conf" });
    }
    if (
      msg.body != 1 &&
      msg.body != 2 &&
      msg.body != 3 &&
      message != "voltar"
    ) {
      dificuldade(msg, client);
      client.sendMessage(
        msg.from,
        `Qual vai ser a forma de pagamento ?

*1* - Dinheiro
*2* - Cartão
*3* - Pix`
      );
    }
  }

  if (recuperarEtapa.etapa == "l") {
    voltar(msg, client);
    if (message != "voltar") {
      const response = await Requests.atualizarPedido({
        telefone: msg.from,
        troco: `${msg.body == "1" ? "" : msg.body}`,
      });

      const valor = await somarValorTotal(response);

      gerarTemplateString(response, msg.from, client, valor);

      desejaConfirmarOPedido(msg.from, client);
      Requests.atualizarEtapa(msg.from, { etapa: "conf" });
    }
  }

  if (recuperarEtapa.etapa == "conf") {
    voltar(msg, client);
    if (msg.body == "1" && message != "voltar") {
      client.sendMessage(
        msg.from,
        `Seu pedido foi *confirmado com sucesso*. Obrigado pela confiança!

Nossa equipe está animada para preparar a sua deliciosa pizza e entregá-la com todo cuidado e sabor. 😃🍕`
      );
      console.log("PEDIDO FINALIZADO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      const response = await Requests.atualizarPedido({
        telefone: msg.from,
        pedidoconfirmado: true,
      });

      if (response.formadepagamento == "pix") {
        client.sendMessage(
          msg.from,
          `⬇️ A chave do *pix* é o telefone abaixo.
        
Pizzas Primo Delivery/ Carlos Alexandre Primo 
Banco C6Bank

Assim que terminar de fazer o pix, nos envie o comprovante por favor, assim já deixo como pago na comanda!`
        );
        client.sendMessage(msg.from, "14998593589");
        Requests.atualizarEtapa(msg.from, { etapa: "comp" });
      } else if (response.formadepagamento != "pix") {
        Requests.atualizarEtapa(msg.from, { etapa: "a", ativado2: false });
      }
    } else if (msg.body == "2" && message != "voltar") {
      console.log("NÂO TEM COISA ERRADA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      client.sendMessage(
        msg.from,
        `Ok, aguarde um instante!
        
Um de nossos colaboradores já vai te atender.`
      );
      // numeroDeTelefone
      client.sendMessage(
        "5514998908820@c.us",
        `Atenção ⚠️
        
O cliente do numero telefone abaixo está precisando de ajuda! Pois ele selecionou a opção que as informações do pedido não estão corretas.`
      );
      client.sendMessage("5514998908820@c.us", `${msg.from.slice(2, 13)}`);
      Requests.atualizarEtapa(msg.from, { etapa: "a", ativado2: false });
    } else if (msg.body != "1" && msg.body != "2" && message != "voltar") {
      client.sendMessage(msg.from, `Atenção ⚠️`);
      dificuldade(msg, client);
      desejaConfirmarOPedido(msg.from, client);
    }
  }

  if (
    recuperarEtapa.etapa == "comp" &&
    msg.duration == undefined &&
    msg.mediaKey != undefined
  ) {
    voltar(msg, client);
    client.sendMessage(
      msg.from,
      `Obrigado por nos enviar o comprovante!
      
Agradecemos pela sua colaboração!`
    );
    Requests.atualizarEtapa(msg.from, { etapa: "a", ativado2: false });
  }
}

module.exports = { pedidos };
