const axios = require("axios");
const { Requests } = require("./requests");

async function IA(sabor) {
  // const pizzas = await Requests.listarPizzas();
  // console.log(pizzas);

  const pergunta = `Com base na FRASE fornecida, desejo que encontre o objeto na lista de dados que tenha a propriedade "nome" mais semelhante à FRASE. Em seguida, gostaria de receber um array contendo os objetos que possuem a propriedade "nome" mais semelhante à FRASE fornecida.

Desejo deseja receber um array de objetos como resposta

Se a frase mencionar apenas um sabor de pizza, retorne apenas um objeto dentro do array. Se a frase mencionar dois sabores de pizza, retorne dois objetos.

Regra: Em nenhuma hipotese retorne mais do que 2 objetos no array.
Regra: Não retorne mais que dois objetos dentro do array.
Regra: Não quero um código em JAVASCRIPT, quero apenas um array como resposta.
Regra: me retornar em formato JSON.

const DADOS = [
  { id: 1, nome: 'a moda', grande: 45, media: 40 },
  { id: 2, nome: 'alho e tomate', grande: 34, media: 30 },
  { id: 3, nome: 'alface', grande: 38, media: 34 },
  { id: 4, nome: 'americano', grande: 40, media: 36 },
  { id: 5, nome: 'atum', grande: 38, media: 34 },
  { id: 6, nome: 'atum especial', grande: 41, media: 37 },
  { id: 7, nome: 'brasileira', grande: 43, media: 38 },
  { id: 8, nome: 'baiana', grande: 36, media: 32 },
  { id: 9, nome: 'bacon', grande: 36, media: 32 },
  { id: 10, nome: 'bacon c/ cheddar', grande: 42, media: 38 },
  { id: 11, nome: 'brocolis', grande: 40, media: 35 },
  { id: 12, nome: 'batata palha', grande: 40, media: 35 },
  { id: 13, nome: 'calabresa', grande: 36, media: 32 },
  { id: 14, nome: 'doritos', grande: 45, media: 40 },
  { id: 15, nome: 'frango barbecue', grande: 40, media: 35 },
  { id: 16, nome: 'frango c/ bacon', grande: 42, media: 34 },
  { id: 17, nome: 'frango c/ catupiry', grande: 38, media: 34 },
  { id: 18, nome: 'lombo', grande: 36, media: 32 },
  { id: 19, nome: 'lombo c/ catupiry', grande: 39, media: 35 },
  { id: 20, nome: 'lombo c/ cheddar', grande: 40, media: 35 },
  { id: 21, nome: 'marguerita', grande: 36, media: 32 },
  { id: 22, nome: 'milho c/ catupiry', grande: 36, media: 30 },
  { id: 23, nome: 'mista', grande: 38, media: 34 },
  { id: 24, nome: 'moda do pizzaiolo', grande: 45, media: 40 },
  { id: 25, nome: 'mussarela', grande: 37, media: 33 },
  { id: 26, nome: 'palmito c/ catupiry', grande: 38, media: 34 },
  { id: 27, nome: 'pepperoni', grande: 44, media: 40 },
  { id: 28, nome: 'portuguesa', grande: 40, media: 36 },
  { id: 29, nome: 'presunto', grande: 36, media: 32 },
  { id: 30, nome: 'presunto c/ catupiry', grande: 38, media: 32 },
  { id: 31, nome: 'provolone', grande: 36, media: 30 },
  { id: 32, nome: 'salame', grande: 40, media: 35 },
  { id: 33, nome: '3 queijos', grande: 38, media: 34 },
  { id: 34, nome: 'tres queijos', grande: 38, media: 34 },
  { id: 35, nome: '3 queijos c/ bacon', grande: 42, media: 38 },
  { id: 36, nome: 'tres queijos c/ bacon', grande: 42, media: 38 },
  { id: 37, nome: '4 queijos', grande: 40, media: 36 },
  { id: 38, nome: 'quatro queijos', grande: 40, media: 36 },
  { id: 39, nome: 'toscana', grande: 36, media: 34 },
  { id: 40, nome: 'vegetariana', grande: 38, media: 34 },
  { id: 41, nome: 'banana', grande: 32, media: 30 },
  { id: 42, nome: 'banana nevada', grande: 36, media: 32 },
  { id: 43, nome: 'chocolate', grande: 36, media: 32 },
  { id: 44, nome: 'chocoduo', grande: 38, media: 34 },
  { id: 45, nome: 'chocolate c/ pacoca', grande: 38, media: 34 },
  { id: 46, nome: 'laka oreo', grande: 40, media: 35 }
]

const FRASE = ${sabor}`;

  const response = await chatGPT(pergunta)
    .then((reply) => {
      return reply;
    })
    .catch((error) => {
      console.error("Erro:", error);
    });

  return response;

  async function chatGPT(message) {
    const OPENAI_API_KEY =
      "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";
    const API_URL = "https://api.openai.com/v1/chat/completions";

    try {
      const response = await axios.post(
        API_URL,
        {
          messages: [{ role: "user", content: message }],
          model: "gpt-3.5-turbo",
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { choices } = response.data;
      const reply = choices[0].message.content;
      return reply;
    } catch (error) {
      console.error("Error:", error.response.data);
      return null;
    }
  }
}

module.exports = { IA };
