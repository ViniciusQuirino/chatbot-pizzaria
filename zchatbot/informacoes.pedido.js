const {
  obterRepresentacaoOrdinal,
  interpretarIngredientes,
} = require("./scripts");

function gerarTemplateString(response, from, client, valor) {
  let template = `*Numero do pedido:* ${response.id}
*Quantidade*: ${response.qnt}
  `;

  for (let i = 1; i <= response.qnt; i++) {
    const ordinal = obterRepresentacaoOrdinal(i);
    let ing = "";
    if (response["adcingrediente" + i] != null) {
      ing = interpretarIngredientes(response["adcingrediente" + i]);
    }

    template += `
${response.qnt > 1 ? `*${ordinal} PIZZA:*` : ""}${
      response.qnt > 1 ? "\n" : ""
    }*Sabor:* ${response["sabor" + i]}
${
  response["bordarecheada" + i] !== null
    ? `*Borda:* ${response["bordarecheada" + i]}`
    : ""
}${response["bordarecheada" + i] !== null ? "\n" : ""}*Tamanho:* ${
      response["tamanho" + i]
    }
${response["obs" + i] !== null ? `*Obs:* ${response["obs" + i]}` : ""}${
      response["obs" + i] !== null ? "\n" : ""
    }${response["adcingrediente" + i] !== null ? `*Adicional:* ${ing}` : ""}${
      response["adcingrediente" + i] !== null ? "\n" : ""
    }`;
  }

  if (response.endereco != null) {
    if (
      response.formadepagamento == "pix" ||
      response.formadepagamento == "cartão"
    ) {
      template += `
${
  response.refrigerante !== null
    ? `*Refrigerante:* ${response.qntrefrigerante}x - ${response.refrigerante}`
    : ""
}${response.refrigerante !== null ? "\n" : ""}*Forma de pagamento:* ${
        response.formadepagamento
      }
*Telefone:* ${response.telefone.slice(2, 13)}
  
${
  response.endereco !== null
    ? `*Endereço de entrega:* ${response.endereco} - ${
        response.cidade == 1 ? "Igaraçu do Tietê" : "Barra Bonita"
      }`
    : ""
}
            
*Valor total:* R$ ${valor},00`;
    } else if (response.formadepagamento == "dinheiro") {
      template += `
${
  response.refrigerante !== null
    ? `*Refrigerante:* ${response.qntrefrigerante}x - ${response.refrigerante}`
    : ""
}${response.refrigerante !== null ? "\n" : ""}*Forma de pagamento:* ${
        response.formadepagamento
      }
*Telefone:* ${response.telefone.slice(2, 13)}
  
${response.troco !== "" ? `*Troco:* ${response.troco}` : "*Troco:* não precisa"}
${
  response.endereco !== null
    ? `*Endereço de entrega:* ${response.endereco} - ${
        response.cidade == 1 ? "Igaraçu do Tietê" : "Barra Bonita"
      }`
    : ""
}
        
*Valor total:* R$ ${valor},00`;
    }
  } else {
    if (
      response.formadepagamento == "pix" ||
      response.formadepagamento == "cartão"
    ) {
      template += `
${
  response.refrigerante !== null
    ? `*Refrigerante:* ${response.qntrefrigerante}x - ${response.refrigerante}`
    : ""
}${response.refrigerante !== null ? "\n" : ""}*Forma de pagamento:* ${
        response.formadepagamento
      }
*Telefone:* ${response.telefone.slice(2, 13)}

${response.endereco == null && "*Retirar no local*"}
             
*Valor total:* R$ ${valor},00`;
    } else if (response.formadepagamento == "dinheiro") {
      template += `
${
  response.refrigerante !== null
    ? `*Refrigerante:* ${response.qntrefrigerante}x - ${response.refrigerante}`
    : ""
}${response.refrigerante !== null ? "\n" : ""}*Forma de pagamento:* ${
        response.formadepagamento
      }
*Telefone:* ${response.telefone.slice(2, 13)}
${response.troco !== "" ? `*Troco:* ${response.troco}` : "*Troco:* não precisa"}

${response.endereco == null && "*Retirar no local*"}
    
*Valor total:* R$ ${valor},00`;
    }
  }

  client.sendMessage(from, template);
  client.sendMessage("5514998908820@c.us", template);
  client.sendMessage("5514998434664@c.us", template);
}

module.exports = { gerarTemplateString };
