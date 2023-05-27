const numeroDeTelefone = "5514998536591@c.us";
const { Requests } = require("./requests");
const {
  cardapio,
  gostouDoNossoCardapio,
  querQueEntregue,
  verificarNumero,
  desejaConfirmarOPedido,
} = require("./scripts");

async function pedidos(recuperarEtapa, msg, client) {
  let message = msg.body.toLowerCase();
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
        `Quer adicionar *borda recheada* ?

⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*

*1* - Não quero
*2* - Catupiry R$ 10,00
*3* - Cheddar R$ 10,00
*4* - Chocolate R$ 12,00`
      );
      Requests.atualizarPedido({ telefone: msg.from, tamanho1: "grande" });
      Requests.atualizarEtapa(msg.from, { etapa: "d" });
    }
    if (msg.body == "2") {
      client.sendMessage(
        msg.from,
        `Quer adicionar *borda recheada* ?

⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*

*1* - Não quero
*2* - Catupiry R$ 10,00
*3* - Cheddar R$ 10,00
*4* - Chocolate R$ 12,00`
      );
      Requests.atualizarPedido({ telefone: msg.from, tamanho1: "media" });
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
    if (msg.body == "1") {
      client.sendMessage(
        msg.from,
        `Qual o *sabor* da pizza que deseja ?

Se você quiser meia de uma e meia de outra, pode informar aqui mesmo por favor 😃`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "e" });
    }
    if (msg.body == "2") {
      client.sendMessage(
        msg.from,
        `Qual o *sabor* da pizza que deseja ?

Se você quiser meia de uma e meia de outra, pode informar aqui mesmo por favor 😃`
      );
      Requests.atualizarPedido({
        telefone: msg.from,
        bordarecheada1: "catupiry",
      });
      Requests.atualizarEtapa(msg.from, { etapa: "e" });
    }
    if (msg.body == "3") {
      client.sendMessage(
        msg.from,
        `Qual o *sabor* da pizza que deseja ?

Se você quiser meia de uma e meia de outra, pode informar aqui mesmo por favor 😃`
      );
      Requests.atualizarPedido({
        telefone: msg.from,
        bordarecheada1: "cheddar",
      });
      Requests.atualizarEtapa(msg.from, { etapa: "e" });
    }
    if (msg.body == "4") {
      client.sendMessage(
        msg.from,
        `Qual o *sabor* da pizza que deseja ?

Se você quiser meia de uma e meia de outra, pode informar aqui mesmo por favor 😃`
      );
      Requests.atualizarPedido({
        telefone: msg.from,
        bordarecheada1: "chocolate",
      });
      Requests.atualizarEtapa(msg.from, { etapa: "e" });
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

  if (recuperarEtapa.etapa == "e") {
    client.sendMessage(
      msg.from,
      `Há algum ingrediente que você gostaria de retirar ou adicionar ?

Caso deseje fazer alguma alteração, por favor, escreva o ingrediente que você gostaria de acrescentar ou remover.

⬇️ Se preferir manter a receita original, basta digitar o número 1.

1 - Não quero adicionar e retirar nenhum ingrediente.`
    );
    Requests.atualizarPedido({ telefone: msg.from, sabor1: msg.body });
    Requests.atualizarEtapa(msg.from, { etapa: "f" });
  }

  if (recuperarEtapa.etapa == "f") {
    if (msg.body == "1") {
      client.sendMessage(
        msg.from,
        `Ok, você deseja algo para *beber* ? 🥤
  
  ⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*
  
*1* - Não quero.
*2* - Coca-Cola 2 Litros R$ 14,00
*3* - Conquista Guaraná 2 Litros R$ 8,00`
      );

      Requests.atualizarEtapa(msg.from, { etapa: "g" });
    } else if (msg.body != "1") {
      client.sendMessage(
        msg.from,
        `Ok, você deseja algo para *beber* ? 🥤

⬇️ Escolha uma das opções abaixo digitando *apenas o numero.*
  
*1* - Não quero.
*2* - Coca-Cola 2 Litros R$ 14,00
*3* - Conquista Guaraná 2 Litros R$ 8,00`
      );

      Requests.atualizarPedido({ telefone: msg.from, obs1: msg.body });
      Requests.atualizarEtapa(msg.from, { etapa: "g" });
    }
  }

  if (recuperarEtapa.etapa == "g") {
    if (msg.body == "1") {
      querQueEntregue(msg.from, client);
      Requests.atualizarEtapa(msg.from, { etapa: "i" });
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
      Requests.atualizarEtapa(msg.from, { etapa: "i" });
    } else if (verificarResposta == "") {
      client.sendMessage(
        msg.from,
        `Atenção ⚠️

*Quantos refrigerantes* você quer, digite a quantidade por favor!!!`
      );
    }
  }

  if (recuperarEtapa.etapa == "i") {
    if (msg.body == "1") {
      client.sendMessage(
        msg.from,
        ` ⏩ Digite o seu endereço de entrega completo.

*NOME DA RUA, NUMERO E NOME DA CIDADE*`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "j" });
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
      client.sendMessage(
        msg.from,
        `*Numero do pedido:* ${response.id}
*Quantidade*: ${response.qnt}
*Sabor:* ${response.sabor1}

${
  response.bordarecheada1 != null
    ? `*Borda:* ${response.bordarecheada1}`
    : `*Borda:*`
}
*Tamanho:* ${response.tamanho1}
${response.obs1 != null ? `*Obs:* ${response.obs1}` : `*Obs:*`}

${
  response.refrigerante == null
    ? "*Refrigerante:*"
    : `*Refrigerante:* ${response.qntrefrigerante}x - ${response.refrigerante}`
}
*Forma de pagamento:* ${response.formadepagamento}

*Telefone:* ${response.telefone.slice(2, 13)}
${
  response.endereco != null
    ? `*Endereço de entrega:* ${response.endereco}`
    : "*Endereço de entrega:*"
}`
      );

      desejaConfirmarOPedido(msg.from, client);
      Requests.atualizarEtapa(msg.from, { etapa: "conf" });
    }
    if (msg.body == "3") {
      const response = await Requests.atualizarPedido({
        telefone: msg.from,
        formadepagamento: "pix",
      });
      client.sendMessage(
        msg.from,
        `*Numero do pedido:* ${response.id}
*Quantidade*: ${response.qnt}
*Sabor:* ${response.sabor1}

${
  response.bordarecheada1 != null
    ? `*Borda:* ${response.bordarecheada1}`
    : `*Borda:*`
}
*Tamanho:* ${response.tamanho1}
${response.obs1 != null ? `*Obs:* ${response.obs1}` : `*Obs:*`}

${
  response.refrigerante == null
    ? "*Refrigerante:*"
    : `*Refrigerante:* ${response.qntrefrigerante}x - ${response.refrigerante}`
}
*Forma de pagamento:* ${response.formadepagamento}

*Telefone:* ${response.telefone.slice(2, 13)}
${
  response.endereco != null
    ? `*Endereço de entrega:* ${response.endereco}`
    : "*Endereço de entrega:*"
}`
      );
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
    client.sendMessage(
      msg.from,
      `*Numero do pedido:* ${response.id}
*Quantidade*: ${response.qnt}
*Sabor:* ${response.sabor1}

${
  response.bordarecheada1 != null
    ? `*Borda:* ${response.bordarecheada1}`
    : `*Borda:*`
}
*Tamanho:* ${response.tamanho1}
${response.obs1 != null ? `*Obs:* ${response.obs1}` : `*Obs:*`}
  
${
  response.refrigerante == null
    ? "*Refrigerante:*"
    : `*Refrigerante:* ${response.qntrefrigerante}x - ${response.refrigerante}`
}
*Forma de pagamento:* ${response.formadepagamento}

*Telefone:* ${response.telefone.slice(2, 13)}
${
  response.endereco != null
    ? `*Endereço de entrega:* ${response.endereco}`
    : "*Endereço de entrega:*"
}
${response.troco != "" ? `*Troco:* ${response.troco}` : "*Troco:*"}`
    );

    desejaConfirmarOPedido(msg.from, client);
    Requests.atualizarEtapa(msg.from, { etapa: "conf" });
  }

  if (recuperarEtapa.etapa == "conf") {
    if (msg.body == "1") {
      client.sendMessage(
        msg.from,
        `Seu pedido foi *confirmado com sucesso*. Obrigado pela confiança! 😃🍕`
      );
      Requests.atualizarEtapa(msg.from, { etapa: "a" });
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
      client.sendMessage(from, `Atenção ⚠️`);
      desejaConfirmarOPedido(msg.from, client);
    }
  }
}

module.exports = { pedidos };