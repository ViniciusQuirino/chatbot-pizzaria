const numeroDeTelefone = "5514998536591@c.us";
const { Requests } = require("./requests");
const {
  cardapio,
  gostouDoNossoCardapio,
  querQueEntregue,
  verificarNumero,
  desejaConfirmarOPedido,
  desejaAlgoParaBeber,
  encontrarObjetosIguais,
} = require("./scripts");
const { gerarTemplateString } = require("./informacoes.pedido");
const { somarValorTotal } = require("./valor.total");
const { removerAcentos } = require("./atualizar.pizza");
const { corrigirPalavrasParecidas } = require("./corrigir.palavras");

async function pedidos(recuperarEtapa, msg, client) {
  if (recuperarEtapa.etapa == "a") {
    const response = await Requests.recuperarTempo();
    client.sendMessage(
      msg.from,
      `Olá! 😃
Eu sou o assistente virtual da Pizzaria Primo e estou aqui para te ajudar. Temos uma variedade de opções deliciosas no nosso cardápio.

Tempo de entrega: ${response.tempoentrega}
Tempo p/ retirar: ${response.temporetirada}

⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*

*1* - Cardápio
*2* - Fazer pedido
*3* - Promoções
*4* - Redes Sociais`
    );
    Requests.atualizarEtapa(msg.from, { etapa: "b" });
  }

  if (recuperarEtapa.etapa == "b") {
    if (msg.body == "1") {
      await cardapio(msg.from);
      gostouDoNossoCardapio(msg.from, client);
      Requests.atualizarEtapa(msg.from, { etapa: "c" });
    }
    if (msg.body == "2") {
      await cardapio(msg.from);
      gostouDoNossoCardapio(msg.from, client);
      Requests.atualizarEtapa(msg.from, { etapa: "c" });
    }
    if (msg.body == "3") {
      await cardapio(msg.from);
      gostouDoNossoCardapio(msg.from, client);
      Requests.atualizarEtapa(msg.from, { etapa: "c" });
    }
    if (msg.body == "4") {
      client.sendMessage(
        msg.from,
        `https://www.instagram.com/pizzasprimodelivery/`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "a" });
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
⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*

*1* - Cardápio
*2* - Fazer pedido
*3* - Promoções
*4* - Redes Sociais`
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
  
Qual o *tamanho* que você quer ?

⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*

*1 - Grande 🍕*
*2 - Média 🍕*`
        );
        Requests.criarPedido({ telefone: msg.from, qnt: 1 });
        Requests.atualizarEtapa(msg.from, { etapa: "bord" });
      }
      if (resposta >= 2) {
        client.sendMessage(
          msg.from,
          `Certo, então são ${resposta} pizzas. Agora me responde uma coisa, todas são *tamanho* grande ?
  
1 - Sim, as ${resposta} pizzas são tamanho grande.
2 - Não, tem pizza que vai ser tamanho médio.`
        );
        Requests.criarPedido({ telefone: msg.from, qnt: resposta });
        Requests.atualizarEtapa(msg.from, { etapa: "1" });
      }
    } else if (verificarResposta == "") {
      client.sendMessage(
        msg.from,
        `Atenção ⚠️
*Quantas pizzas* você vai querer ? Digite *apenas o numero.*`
      );
    }
  }

  if (recuperarEtapa.etapa == "bord") {
    if (msg.body == "1") {
      client.sendMessage(
        msg.from,
        `Qual o *sabor* da pizza que deseja ?

Se você quiser *MEIO A MEIO*, pode informar aqui mesmo por favor 😃`
      );

      Requests.atualizarPedido({ telefone: msg.from, tamanho1: "grande" });
      Requests.atualizarEtapa(msg.from, { etapa: "d" });
    }
    if (msg.body == "2") {
      client.sendMessage(
        msg.from,
        `Qual o *sabor* da pizza que deseja ?

Se você quiser *MEIO A MEIO*, pode informar aqui mesmo por favor 😃`
      );
      Requests.atualizarPedido({ telefone: msg.from, tamanho1: "média" });
      Requests.atualizarEtapa(msg.from, { etapa: "d" });
    }
    if (msg.body != "1" && msg.body != "2") {
      client.sendMessage(
        msg.from,
        `Atenção ⚠️
⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*

*1 - Grande 🍕*
*2 - Média 🍕*`
      );
    }
  }

  if (recuperarEtapa.etapa == "d") {
    const retorno = removerAcentos(msg.body);
    const frasePronta = corrigirPalavrasParecidas(retorno);
    const encontrar = encontrarObjetosIguais(frasePronta);

    if (encontrar[0]) {
      client.sendMessage(
        msg.from,
        `Há algum ingrediente que você gostaria de retirar ou adicionar ?
  
Caso deseje fazer alguma alteração, por favor, escreva o ingrediente que você gostaria de acrescentar ou remover.

⬇️ Se preferir manter a receita original, basta digitar o número 1.

1 - Não quero adicionar e retirar nenhum ingrediente.`
      );
      Requests.atualizarPedido({ telefone: msg.from, sabor1: frasePronta });
      Requests.atualizarEtapa(msg.from, { etapa: "e" });
    } else {
      client.sendMessage(
        msg.from,
        `Desculpa, mas não encontrei nenhuma pizza com esse nome, por favor digite corretamente o nome da pizza!`
      );
    }
  }

  if (recuperarEtapa.etapa == "e") {
    if (msg.body == "1") {
      client.sendMessage(
        msg.from,
        `Quer adicionar *borda recheada* ?
  
⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*
  
*1* - Não quero
*2* - Catupiry R$ 10,00
*3* - Cheddar R$ 10,00
*4* - Chocolate R$ 12,00`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "f" });
    } else if (msg.body != "1") {
      client.sendMessage(
        msg.from,
        `Quer adicionar *borda recheada* ?
  
⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*
  
*1* - Não quero
*2* - Catupiry R$ 10,00
*3* - Cheddar R$ 10,00
*4* - Chocolate R$ 12,00`
      );
      Requests.atualizarPedido({ telefone: msg.from, obs1: msg.body });
      Requests.atualizarEtapa(msg.from, { etapa: "f" });
    }
  }

  if (recuperarEtapa.etapa == "f") {
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

  if (recuperarEtapa.etapa == "g") {
    if (msg.body == "1") {
      querQueEntregue(msg.from, client);
      Requests.atualizarEtapa(msg.from, { etapa: "ent" });
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
    if (msg.body != "1" && msg.body != "2" && msg.body != "3") {
      client.sendMessage(
        msg.from,
        `Atenção ⚠️
Você deseja algo para *beber* ? 🥤

⬇ Escolha uma das opções abaixo digitando *apenas o numero.*
 
*1* - Não quero.
*2* - Coca-Cola 2 Litros R$ 14,00
*3* - Conquista Guaraná 2 Litros R$ 8,00`
      );
    }
  }

  if (recuperarEtapa.etapa == "h") {
    const verificarResposta = verificarNumero(msg.body);
    if (verificarResposta) {
      querQueEntregue(msg.from, client);
      Requests.atualizarPedido({
        telefone: msg.from,
        qntrefrigerante: +verificarResposta,
      });
      Requests.atualizarEtapa(msg.from, { etapa: "ent" });
    } else if (verificarResposta == "") {
      client.sendMessage(
        msg.from,
        `Atenção ⚠️

*Quantos refrigerantes* você quer, digite a quantidade por favor!!!`
      );
    }
  }

  if (recuperarEtapa.etapa == "ent") {
    if (msg.body == "1") {
      client.sendMessage(
        msg.from,
        `⬇️ Qual é a cidade ?
  
*1* - Igaraçu do Tietê
*2* - Barra Bonita`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "i" });
    }

    if (msg.body == "2") {
      client.sendMessage(
        msg.from,
        `Blzaa 😃

Nosso *endereço* fica localizado em igaraçu, rua X N:50`
      );
      client.sendMessage(
        msg.from,
        `Qual vai ser a forma de pagamento ?
  
⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*

*1* - Dinheiro
*2* - Cartão
*3* - Pix`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "k" });
    }
    if (msg.body != "1" && msg.body != "2") {
      client.sendMessage(
        msg.from,
        `Atenção ⚠️

Você quer que *entregue* ?

Valores:
Dentro de igaraçu: 7,00 reais
Igaraçu x Barra: 9,00 reais

⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*

*1* - Sim, quero que entregue.
*2* - Não, vou ir buscar.`
      );
    }
  }

  if (recuperarEtapa.etapa == "i") {
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
  }

  if (recuperarEtapa.etapa == "j") {
    client.sendMessage(
      msg.from,
      `Qual vai ser a forma de pagamento ?

⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*

*1* - Dinheiro
*2* - Cartão
*3* - Pix`
    );
    Requests.atualizarPedido({ telefone: msg.from, endereco: msg.body });
    Requests.atualizarEtapa(msg.from, { etapa: "k" });
  }

  if (recuperarEtapa.etapa == "k") {
    if (msg.body == "1") {
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
    if (msg.body == "2") {
      const response = await Requests.atualizarPedido({
        telefone: msg.from,
        formadepagamento: "cartão",
      });
      gerarTemplateString(response, msg.from, client);
      await somarValorTotal(response, msg, client);

      desejaConfirmarOPedido(msg.from, client);
      Requests.atualizarEtapa(msg.from, { etapa: "conf" });
    }
    if (msg.body == "3") {
      const response = await Requests.atualizarPedido({
        telefone: msg.from,
        formadepagamento: "pix",
      });
      gerarTemplateString(response, msg.from, client);
      await somarValorTotal(response, msg, client);

      desejaConfirmarOPedido(msg.from, client);
      Requests.atualizarEtapa(msg.from, { etapa: "conf" });
    }
    if (msg.body != 1 && msg.body != 2 && msg.body != 3) {
      client.sendMessage(
        msg.from,
        `Atenção ⚠️
Qual vai ser a forma de pagamento ?
  
⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*

*1* - Dinheiro
*2* - Cartão
*3* - Pix`
      );
    }
  }

  if (recuperarEtapa.etapa == "l") {
    const response = await Requests.atualizarPedido({
      telefone: msg.from,
      troco: `${msg.body == "1" ? "" : msg.body}`,
    });

    gerarTemplateString(response, msg.from, client);
    await somarValorTotal(response, msg, client);

    desejaConfirmarOPedido(msg.from, client);
    Requests.atualizarEtapa(msg.from, { etapa: "conf" });
  }

  if (recuperarEtapa.etapa == "conf") {
    if (msg.body == "1") {
      client.sendMessage(
        msg.from,
        `Seu pedido foi *confirmado com sucesso*. Obrigado pela confiança! 😃🍕`
      );

      const response = await Requests.recuperarPedido(msg.from);

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
        Requests.atualizarEtapa(msg.from, { etapa: "a" });
      }
    }
    if (msg.body == "2") {
      client.sendMessage(
        msg.from,
        `Ok, aguarde um instante!
        
Um de nossos colaboradores já vai te atender.`
      );
      client.sendMessage(numeroDeTelefone, `${msg.from.slice(2, 13)}`);
      client.sendMessage(
        numeroDeTelefone,
        `Atenção ⚠️
Tem um cliente precisando de ajuda!`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "des" });
    }
    if (msg.body != 1 && msg.body != 2) {
      client.sendMessage(msg.from, `Atenção ⚠️`);
      desejaConfirmarOPedido(msg.from, client);
    }
  }

  if (recuperarEtapa.etapa == "comp" && msg.mediaKey != undefined) {
    client.sendMessage(
      msg.from,
      `Obrigado por nos enviar o comprovante!
      
Agradecemos pela sua colaboração!`
    );
    Requests.atualizarEtapa(msg.from, { etapa: "a" });
  }
}

module.exports = { pedidos };
