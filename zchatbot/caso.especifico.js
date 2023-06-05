const Fuse = require("fuse.js");
const dados = [
  { nome: "a moda", media: "40,00", grande: "45,00" },
  { nome: "alho e tomate", media: "30,00", grande: "34,00" },
  { nome: "alface", media: "34,00", grande: "38,00" },
  { nome: "americano", media: "36,00", grande: "40,00" },
  { nome: "atum especial", media: "37,00", grande: "41,00" },
  { nome: "atum", media: "34,00", grande: "38,00" },
  { nome: "brasileira", media: "38,00", grande: "43,00" },
  { nome: "baiana", media: "32,00", grande: "36,00" },
  { nome: "bacon", media: "32,00", grande: "36,00" },
  { nome: "bacon cheddar", media: "38,00", grande: "42,00" },
  { nome: "brocolis", media: "35,00", grande: "40,00" },
  { nome: "batata palha", media: "35,00", grande: "40,00" },
  { nome: "calabresa", media: "32,00", grande: "36,00" },
  { nome: "doritos", media: "40,00", grande: "45,00" },
  { nome: "frango barbecue", media: "35,00", grande: "40,00" },
  { nome: "frango c/ bacon", media: "34,00", grande: "42,00" },
  { nome: "frango c/ catupiry", media: "34,00", grande: "38,00" },
  { nome: "lombo", media: "32,00", grande: "36,00" },
  { nome: "lombo c/ catupiry", media: "35,00", grande: "39,00" },
  { nome: "lombo c/ cheddar", media: "35,00", grande: "40,00" },
  { nome: "marguerita", media: "32,00", grande: "36,00" },
  { nome: "milho c/ catupiry", media: "30,00", grande: "36,00" },
  { nome: "mista", media: "34,00", grande: "38,00" },
  { nome: "moda do pizzaiolo", media: "40,00", grande: "45,00" },
  { nome: "mussarela", media: "33,00", grande: "37,00" },
  { nome: "palmito c/ catupiry", media: "34,00", grande: "38,00" },
  { nome: "pepperoni", media: "40,00", grande: "44,00" },
  { nome: "portuguesa", media: "36,00", grande: "40,00" },
  { nome: "presunto", media: "32,00", grande: "36,00" },
  { nome: "presunto c/ catupiry", media: "32,00", grande: "38,00" },
  { nome: "provolone", media: "30,00", grande: "36,00" },
  { nome: "salame", media: "35,00", grande: "40,00" },
  { nome: "3 queijos", media: "34,00", grande: "38,00" },
  { nome: "tres queijos", media: "34,00", grande: "38,00" },
  { nome: "3 queijos c/ bacon", media: "38,00", grande: "42,00" },
  { nome: "tres queijos c/ bacon", media: "38,00", grande: "42,00" },
  { nome: "4 queijos", media: "36,00", grande: "40,00" },
  { nome: "quatro queijos", media: "36,00", grande: "40,00" },
  { nome: "toscana", media: "34,00", grande: "36,00" },
  { nome: "vegetariana", media: "34,00", grande: "38,00" },
  { nome: "banana nevada", media: "32,00", grande: "36,00" },
  { nome: "banana", media: "30,00", grande: "32,00" },
  { nome: "chocolate", media: "32,00", grande: "36,00" },
  { nome: "chocoduo", media: "34,00", grande: "38,00" },
  { nome: "chocolate c/ pacoca", media: "34,00", grande: "38,00" },
  { nome: "laka oreo", media: "35,00", grande: "40,00" },
];

function encontrarObjetos(frase) {
  const expressao = /1\/2/;
  const contemOcorrencia = expressao.test(frase);

  if (contemOcorrencia) {
    const regex = /1\/2\s(.?)\se\s1\/2\s(.?)$/;
    const matches = frase.match(regex);

    if (matches) {
      const sabor1 = matches[1];
      const sabor2 = matches[2];

      const options = {
        keys: ["nome"],
        threshold: -2,
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
        threshold: -2,
      };

      const fuse = new Fuse(dados, options);
      const resultados = fuse.search(frase);

      const objetosEncontrados = resultados.map((resultado) => resultado.item);
      return objetosEncontrados;
    }
  } else {
    const objetosEncontrados = [];

    dados.forEach((pizza) => {
      const sabor = pizza.nome;

      if (frase.includes(sabor)) {
        objetosEncontrados.push(pizza);
      }
    });

    return objetosEncontrados;
  }
}
function corrigirFrase(frase) {
  frase = frase.replace(/\s+/g, " ");
  const objetosEncontrados = encontrarObjetos(frase);

  if (objetosEncontrados.length > 0) {
    const nomesEncontrados = objetosEncontrados.map((objeto) => objeto.nome);
    const regexNomes = new RegExp(nomesEncontrados.join("|"), "g");
    let fraseCorrigida = frase.replace(regexNomes, (match) => `"${match}"`);

    // Adicionar vírgula entre os nomes encontrados
    fraseCorrigida = fraseCorrigida.replace(/" "/g, ", ");

    // Remover todas as aspas (simples e duplas)
    fraseCorrigida = fraseCorrigida.replace(/['"]+/g, "");

    return fraseCorrigida;
  }

  return frase;
}
let a = corrigirFrase("atum especial banana nevada");
console.log(a);
