const dados = [
  { nome: "a moda", media: "40,00", grande: "45,00" },
  { nome: "alho e tomate", media: "30,00", grande: "34,00" },
  { nome: "alface", media: "34,00", grande: "38,00" },
  { nome: "americano", media: "36,00", grande: "40,00" },
  { nome: "atum", media: "34,00", grande: "38,00" },
  { nome: "atum especial", media: "37,00", grande: "41,00" },
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
  { nome: "banana", media: "30,00", grande: "32,00" },
  { nome: "banana nevada", media: "32,00", grande: "36,00" },
  { nome: "chocolate", media: "32,00", grande: "36,00" },
  { nome: "chocoduo", media: "34,00", grande: "38,00" },
  { nome: "chocolate c/ pacoca", media: "34,00", grande: "38,00" },
  { nome: "laka oreo", media: "35,00", grande: "40,00" },
];
let chamadaFeita = false;
function corrigirPalavrasParecidas(frase) {
  let palavrasFrase = frase.toLowerCase().split(" ");
  palavrasFrase = palavrasFrase.filter(Boolean);
  const palavrasCorrigidas = [];

  for (let i = 0; i < palavrasFrase.length; i++) {
    const palavraFrase = palavrasFrase[i];
    let palavraCorrigida = palavraFrase;
    let menorDistancia = Infinity;
    let melhorCorrespondencia = null;

    for (let j = 0; j < dados.length; j++) {
      const objeto = dados[j];
      const palavrasNome = objeto.nome.toLowerCase().split(" ");

      for (let k = 0; k < palavrasNome.length; k++) {
        const palavraNome = palavrasNome[k];
        const distancia = levenshteinDistance(palavraFrase, palavraNome);

        if (
          distancia <= Math.floor(palavraNome.length / 2.5) &&
          distancia < menorDistancia
        ) {
          melhorCorrespondencia = palavraNome;
          menorDistancia = distancia;
        }
      }
    }

    if (melhorCorrespondencia) {
      // Verificar se a próxima palavra é "bacon"

      if (palavrasFrase[i + 1] === "bacon") {
        palavraCorrigida = melhorCorrespondencia + " c/";
      } else {
        palavraCorrigida = melhorCorrespondencia;
      }

      if (
        palavrasFrase[i + 1] === "catupiry" ||
        palavrasFrase[i + 1] === "cheddar" ||
        palavrasFrase[i + 1] === "pacoca" ||
        palavrasFrase[i + 1] === "paçoca"
      ) {
        palavraCorrigida = melhorCorrespondencia + " c/";
      } else {
        palavraCorrigida = melhorCorrespondencia;
      }

      if (melhorCorrespondencia == "moda") {
        palavraCorrigida = "a " + melhorCorrespondencia;
      }

      if (palavrasFrase[i + 1] === "pizzaiolo") {
        palavraCorrigida = melhorCorrespondencia + " do";
      }
    }

    palavrasCorrigidas.push(palavraCorrigida);
  }

  const string = palavrasCorrigidas.join(" ");

  var palavras = string.split(" ");
  var palavrasUnicas = [...new Set(palavras)];
  var stringUnica = palavrasUnicas.join(" ");

  if (
    palavrasFrase[1] == "c" ||
    palavrasFrase[2] == "c" ||
    palavrasFrase[3] == "c" ||
    palavrasFrase[4] == "c" ||
    palavrasFrase[5] == "c" ||
    palavrasFrase[6] == "c" ||
    palavrasFrase[7] == "c" ||
    palavrasFrase[8] == "c" ||
    palavrasFrase[9] == "c" ||
    palavrasFrase[10] == "c" ||
    palavrasFrase[11] == "c" ||
    palavrasFrase[12] == "c"
  ) {
    let result = stringUnica.replace(/c/, "c/");

    return result;
  }
  result = stringUnica.replace(/cm|om|com/, "c/");

  result = result.replace(/1\/2|meia|meio/g, "1/2");
  return result;
}

function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  var matrix = [];

  // Inicializar a matriz
  for (var i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (var j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Calcular a distância
  for (var i = 1; i <= b.length; i++) {
    for (var j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substituição
          matrix[i][j - 1] + 1, // inserção
          matrix[i - 1][j] + 1 // remoção
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// module.exports = { corrigirPalavrasParecidas };