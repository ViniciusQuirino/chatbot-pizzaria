const { encontrarObjetos, calcularValorIngredientes } = require("./scripts");
const { Requests } = require("./requests");

async function somarValorTotal(response) {
  const dados = await Requests.listarPizzas();
  let valor = 0;

  if (response.cidade == 1) {
    for (let i = 0; i < dados.length; i++) {
      if (dados[i].entrega === "Igaraçu do Tietê") {
        valor += dados[i].valor;
      }
    }
  } else if (response.cidade == 2) {
    for (let i = 0; i < dados.length; i++) {
      if (dados[i].entrega === "Barra Bonita") {
        valor += dados[i].valor;
      }
    }
  }

  if (response.refrigerante == "Coca-cola 2 litros") {
    for (let i = 0; i < dados.length; i++) {
      if (dados[i].refri === "Coca-cola 2 Litros") {
        valor += response.qntrefrigerante * dados[i].valor;
      }
    }
  } else if (response.refrigerante == "Conquista guaraná 2 litros") {
    for (let i = 0; i < dados.length; i++) {
      if (dados[i].refri === "Conquista Guaraná 2 Litros") {
        valor += response.qntrefrigerante * dados[i].valor;
      }
    }
  }

  const dataAtual = new Date();
  const diaSemana = dataAtual.getDay(); // 0 (Domingo) a 6 (Sábado)

  for (let i = 1; i <= 10; i++) {
    if (response["bordarecheada" + i] == "catupiry") {
      const objetoBordaCatupiry = dados.find(
        (objeto) => objeto.borda === "Catupiry"
      );
      valor += objetoBordaCatupiry.valor;
    } else if (response["bordarecheada" + i] == "cheddar") {
      const objetoBordaCheddar = dados.find(
        (objeto) => objeto.borda === "Cheddar"
      );
      valor += objetoBordaCheddar.valor;
    } else if (response["bordarecheada" + i] == "chocolate") {
      const objetoBordaChocolate = dados.find(
        (objeto) => objeto.borda === "Chocolate"
      );
      valor += objetoBordaChocolate.valor;
    }

    if (response["adcingrediente" + i] != null) {
      valor += calcularValorIngredientes(response["adcingrediente" + i], dados);
    }

    if (response["sabor" + i] != null) {
      const resultado = await encontrarObjetos(response["sabor" + i], dados);
      console.log(resultado);
      if (resultado.length == 1) {
        if (response["tamanho" + i] == "grande") {
          if (
            diaSemana >= 1 &&
            diaSemana <= 4 &&
            isPromocao(resultado[0].nome)
          ) {
            valor += 30;
          } else if (
            diaSemana >= 1 &&
            diaSemana <= 4 &&
            !isPromocao(resultado[0].nome)
          ) {
            valor += resultado[0].grande;
          } else {
            valor += resultado[0].grande;
          }
        } else if (response["tamanho" + i] == "média") {
          valor += resultado[0].media;
        }
      } else if (resultado.length == 2) {
        const maiorValorSabor = Math.max(
          resultado[0].grande,
          resultado[1].grande
        );
        console.log(maiorValorSabor);
        if (response["tamanho" + i] == "grande") {
        
          if (
            diaSemana >= 1 &&
            diaSemana <= 4 &&
            isPromocao(resultado[0].nome) &&
            isPromocao(resultado[1].nome)
          ) {
            valor += 30;
          } else if (
            diaSemana >= 1 &&
            diaSemana <= 4 &&
            isPromocao(resultado[0].nome)
          ) {
            valor += maiorValorSabor;
          } else if (
            diaSemana >= 1 &&
            diaSemana <= 4 &&
            !isPromocao(resultado[0].nome)
          ) {
            valor += maiorValorSabor;
          } else {
            valor += maiorValorSabor;
          }
        } else if (response["tamanho" + i] == "média") {
          valor += maiorValorSabor;
        }
      }
    }
  }
  return valor;
}

function isPromocao(nomePizza) {
  const pizzasPromocao = [
    "alho e tomate",
    "calabresa",
    "milho c/ catupiry",
    "lombo",
    "presunto",
  ];
  return pizzasPromocao.includes(nomePizza.toLowerCase());
}

module.exports = { somarValorTotal };
