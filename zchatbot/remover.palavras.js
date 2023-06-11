let palavras = [
  "moda",
  "alho",
  "e",
  "tomate",
  "alface",
  "americano",
  "atum",
  "especial",
  "brasileira",
  "baiana",
  "bacon",
  "cheddar",
  "brocolis",
  "batata",
  "palha",
  "calabresa",
  "doritos",
  "frango",
  "barbecue",
  "c/",
  "catupiry",
  "lombo",
  "marguerita",
  "milho",
  "mista",
  "do",
  "pizzaiolo",
  "mussarela",
  "queijo",
  "palmito",
  "pepperoni",
  "portuguesa",
  "presunto",
  "provolone",
  "salame",
  "3",
  "queijos",
  "tres",
  "quatro",
  "toscana",
  "vegetariana",
  "banana",
  "nevada",
  "chocolate",
  "chocoduo",
  "pacoca",
  "laka",
  "oreo",
  "meia",
  "1/2",
  "meio",
];

function removerPalavras(frase) {
  let palavrasFrase = frase.split(" ");

  // Filtrar as palavras que estão presentes no array
  let palavrasFiltradas = palavrasFrase.filter((palavra) =>
    palavras.includes(palavra)
  );

  // Juntar as palavras filtradas de volta em uma frase
  let fraseFiltrada = palavrasFiltradas.join(" ");

  return fraseFiltrada;
}

module.exports = { removerPalavras };
