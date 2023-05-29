const { obterRepresentacaoOrdinal } = require("./scripts");

function gerarTemplateString(response, from, client) {
  let template = `*Numero do pedido:* ${response.id}
*Quantidade*: ${response.qnt}
  `;

  for (let i = 1; i <= response.qnt; i++) {
    const ordinal = obterRepresentacaoOrdinal(i);

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
    }`;
  }

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
${
  response.endereco !== null
    ? `*Endereço de entrega:* ${response.endereco}`
    : ""
}${response.endereco !== null ? "\n" : ""}*Telefone:* ${response.telefone.slice(
      2,
      13
    )}`;

    client.sendMessage(from, template);
  } else if (response.formadepagamento == "dinheiro") {
    template += `
${
  response.refrigerante !== null
    ? `*Refrigerante:* ${response.qntrefrigerante}x - ${response.refrigerante}`
    : ""
}${response.refrigerante !== null ? "\n" : ""}*Forma de pagamento:* ${
      response.formadepagamento
    }
${
  response.endereco !== null
    ? `*Endereço de entrega:* ${response.endereco}`
    : ""
}${response.endereco !== null ? "\n" : ""}*Telefone:* ${response.telefone.slice(
      2,
      13
    )}
${
  response.troco !== "" ? `*Troco:* ${response.troco}` : "*Troco:* não precisa"
}`;

    client.sendMessage(from, template);
  }
}

module.exports = { gerarTemplateString };
