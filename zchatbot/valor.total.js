const { encontrarObjetos, calcularValorIngredientes } = require("./scripts");
const { Requests } = require("./requests");
async function somarValorTotal(response) {
  const dados = await Requests.listarPizzas();
  let valor = 0;

  if (response.cidade == 1) {
    valor += 7;
  } else if (response.cidade == 2) {
    valor += 9;
  }

  if (response.refrigerante == "Coca-cola 2 litros") {
    valor += response.qntrefrigerante * 14;
  } else if (response.refrigerante == "Conquista guaraná 2 litros") {
    valor += response.qntrefrigerante * 8;
  }

  const dataAtual = new Date();
  const diaSemana = dataAtual.getDay(); // 0 (Domingo) a 6 (Sábado)

  for (let i = 1; i <= 10; i++) {
    if (response["bordarecheada" + i] == "catupiry") {
      valor += 10;
    } else if (response["bordarecheada" + i] == "cheddar") {
      valor += 10;
    } else if (response["bordarecheada" + i] == "chocolate") {
      valor += 12;
    }

    if (response["adcingrediente" + i] != null) {
      valor += calcularValorIngredientes(response["adcingrediente" + i]);
    }

    if (response["sabor" + i] != null) {
      const resultado = await encontrarObjetos(response["sabor" + i], dados);
      console.log(resultado);
      if (resultado.length == 1) {
        if (response["tamanho" + i] == "grande") {
          const valorPizza =
            diaSemana >= 1 && diaSemana <= 4 && isPromocao(resultado[0].nome)
              ? 30.0
              : resultado[0].grande;
          valor += valorPizza;
        } else if (response["tamanho" + i] == "média") {
          valor += resultado[0].media;
        }
      } else if (resultado.length == 2) {
        const maiorValorSabor = Math.max(
          resultado[0].grande,
          resultado[1].grande
        );
        if (response["tamanho" + i] == "grande") {
          if (
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
          }
        } else if (response["tamanho" + i] == "média") {
          valor += resultado[0].media;
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
