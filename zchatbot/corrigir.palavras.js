const dados = [
  { nome: "a moda", media: "40,00", grande: "45,00" },
  { nome: "moda", media: "40,00", grande: "45,00" },
  { nome: "alho e tomate", media: "30,00", grande: "34,00" },
  { nome: "alface", media: "34,00", grande: "38,00" },
  { nome: "americano", media: "36,00", grande: "40,00" },
  { nome: "atum especial", media: "37,00", grande: "41,00" },
  { nome: "atum", media: "34,00", grande: "38,00" },
  { nome: "brasileira", media: "38,00", grande: "43,00" },
  { nome: "baiana", media: "32,00", grande: "36,00" },
  { nome: "bacon", media: "32,00", grande: "36,00" },
  { nome: "bacon c/ cheddar", media: "38,00", grande: "42,00" },
  { nome: "brocolis", media: "35,00", grande: "40,00" },
  { nome: "batata palha", media: "35,00", grande: "40,00" },
  { nome: "calabresa", media: "32,00", grande: "36,00" },
  { nome: "doritos", media: "40,00", grande: "45,00" },
  { nome: "frango c/ barbecue", media: "35,00", grande: "40,00" },
  { nome: "frango c/ bacon", media: "34,00", grande: "42,00" },
  { nome: "frango c/ catupiry", media: "34,00", grande: "38,00" },
  { nome: "frango c/ cheddar", media: "35,00", grande: "40,00" },
  { nome: "lombo", media: "32,00", grande: "36,00" },
  { nome: "lombo c/ catupiry", media: "35,00", grande: "39,00" },
  { nome: "lombo c/ cheddar", media: "35,00", grande: "40,00" },
  { nome: "marguerita", media: "32,00", grande: "36,00" },
  { nome: "milho c/ catupiry", media: "30,00", grande: "36,00" },
  { nome: "milho", media: "30,00", grande: "36,00" },
  { nome: "mista", media: "34,00", grande: "38,00" },
  { nome: "moda do pizzaiolo", media: "40,00", grande: "45,00" },
  { nome: "mussarela", media: "33,00", grande: "37,00" },
  { nome: "queijo", media: "33,00", grande: "37,00" },
  { nome: "palmito c/ catupiry", media: "34,00", grande: "38,00" },
  { nome: "palmito", media: "34,00", grande: "38,00" },
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
  {
    nome: "bacon especial",
    grande: 42,
    media: 38,
  },
  {
    nome: "alho",
    grande: 34,
    media: 30,
  },
];

function corrigirPalavrasParecidas(frase, variavelum, variaveldois) {
  // Verifica se há "1/2" após "e" ou ","
  frase = frase
    .replace(/1\/2|meia|meio/g, "1/2")
    .replace(/(\be\s+|,\s+)(?!1\/2)/g, "$1 1/2 ")
    .replace(/1 /g, "")
    .replace(/ pizza /g, "")
    .replace(/ piza /g, "")
    .replace(/ pzza /g, "")
    .replace(/uma coca/g, "")
    .replace(/duas coca/g, "")
    .replace(/guarana/g, "")
    .replace(/conquista/g, "")
    .replace(/ coca/g, "")
    .replace(/ izza /g, "")
    .replace(/ quero| quero |quero/g, "")
    .replace(/ queria| queria |queria/g, "")
    .replace(/ gostaria| gostaria |gostaria/g, "")
    .replace(/chocuduo/g, "chocoduo")
    .replace(/chucuduo/g, "chocoduo")
    .replace(/chucoduo/g, "chocoduo")
    .replace(/ queru| queru |queru/g, "")
    .replace(/alho tomate/g, "alho e tomate")
    .replace(/\s+/g, " ")
    .replace(/(1\/2)\s*\1+/g, "$1");

  frase = frase.trim();

  if (frase.indexOf("1/2") !== -1 && frase.indexOf("1/2") !== 0) {
    frase = "1/2 " + frase;
  }

  frase = frase.replace(/(1\/2)\s*\1+/g, "$1");

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
      if (melhorCorrespondencia !== "alface") {
        if (
          palavrasFrase[i + 1] === "bacon" ||
          palavrasFrase[i + 1] === "catupiry" ||
          palavrasFrase[i + 1] === "cheddar" ||
          palavrasFrase[i + 1] === "pacoca" ||
          palavrasFrase[i + 1] === "barbecue"
        ) {
          palavraCorrigida = melhorCorrespondencia + " c/";
        } else if (melhorCorrespondencia == "moda") {
          palavraCorrigida = "a " + melhorCorrespondencia;
        } else if (melhorCorrespondencia == "pizzaiolo") {
          palavraCorrigida = "do " + melhorCorrespondencia;
        } else {
          palavraCorrigida = melhorCorrespondencia;
        }
      }
    }

    palavrasCorrigidas.push(palavraCorrigida);
  }

  let string = palavrasCorrigidas.join(" ");

  var palavras = string.split(" ");
  var palavrasUnicas = [];

  palavras.forEach((palavra) => {
    if (
      palavra === "bacon" ||
      palavra === "cheddar" ||
      palavra === "3" ||
      palavra === "tres" ||
      palavra === "moda" ||
      palavra === "especial" ||
      palavra === "palha" ||
      palavra === "barbecue" ||
      palavra === "lombo" ||
      palavra === "presunto" ||
      palavra === "chocolate" ||
      palavra === "frango" ||
      palavra === "palmito" ||
      palavra === "c/" ||
      palavra === "4" ||
      palavra === "quatro" ||
      palavra === "queijos" ||
      palavra === "atum" ||
      palavra === "nevada" ||
      palavra === "banana" ||
      palavra === "catupiry" ||
      palavra === "pacoca" ||
      palavra === "oreo" ||
      palavra === "1/2" ||
      !palavrasUnicas.includes(palavra)
    ) {
      palavrasUnicas.push(palavra);
    }
  });

  var stringUnica = palavrasUnicas.join(" ");
  result = stringUnica.replace(/cm|com/g, "c/");
  result = result.replace(/ om /g, " c/ ");

  for (let i = 1; i <= 12; i++) {
    if (palavrasFrase[i] == "c") {
      result = result.replace(/ c/g, " c/");
    }
  }

  result = result.replace(/c\/ c\//g, "c/");

  if (variavelum && variaveldois) {
    variavelum = false;
    const retorno = corrigirPalavrasParecidas(result, variavelum, variaveldois);
    return retorno;
  } else if (!variavelum && variaveldois) {
    variavelum = false;
    variaveldois = false;
    const retorno = corrigirPalavrasParecidas(result, variavelum, variaveldois);
    return retorno;
  } else if (!variavelum && !variaveldois) {
    let contador = 0;

    result = result.replace(/1\/2/g, function (match) {
      contador++;
      if (contador === 2) {
        return "e 1/2";
      } else {
        return match;
      }
    });
    result = result.replace(/ c\/\//g, " c/");
    result = result.replace(/ c\/\/\//g, " c/");
    result = result.replace(/ c\/\/\/\//g, " c/");
    result = result.replace(/ e e /g, " e ");
    result = result.replace(/ ee /g, " e ");
    result = result.replace(/,,/g, " e ");
    result = result.replace(/ e e /g, " e ");
    result = result.replace(/1\/2 e 1\/2/g, "1/2");
    result = result.replace(/,/g, "");
    result = result.replace(/uma e/g, "");
    result = result.replace(/alface c\/ bacon/g, "alface e bacon");
    result = result.replace(/calabresa c\/ bacon/g, "calabresa e bacon");
    result = result.replace(/moda c\/ bacon/g, "moda e bacon");
    result = result.replace(/tomate c\/ bacon/g, "tomate e bacon");
    result = result.replace(/americano c\/ bacon/g, "americano e bacon");
    result = result.replace(/atum c\/ bacon/g, "atum e bacon");
    result = result.replace(/especial c\/ bacon/g, "especial e bacon");
    result = result.replace(/brasileira c\/ bacon/g, "brasileira e bacon");
    result = result.replace(/baiana c\/ bacon/g, "baiana e bacon");
    result = result.replace(/bacon c\/ bacon/g, "bacon e bacon");
    result = result.replace(/brocolis c\/ bacon/g, "brocolis e bacon");
    result = result.replace(/palha c\/ bacon/g, "palha e bacon");
    result = result.replace(/doritos c\/ bacon/g, "doritos e bacon");
    result = result.replace(/barbecue c\/ bacon/g, "barbecue e bacon");
    result = result.replace(/catupiry c\/ bacon/g, "catupiry e bacon");
    result = result.replace(/lombo c\/ bacon/g, "lombo e bacon");
    result = result.replace(/cheddar c\/ bacon/g, "cheddar e bacon");
    result = result.replace(/marguerita c\/ bacon/g, "marguerita e bacon");
    result = result.replace(/mista c\/ bacon/g, "mista e bacon");
    result = result.replace(/mussarela c\/ bacon/g, "mussarela e bacon");
    result = result.replace(/pizzaiolo c\/ bacon/g, "pizzaiolo e bacon");
    result = result.replace(/pepperoni c\/ bacon/g, "pepperoni e bacon");
    result = result.replace(/portuguesa c\/ bacon/g, "portuguesa e bacon");
    result = result.replace(/presunto c\/ bacon/g, "presunto e bacon");
    result = result.replace(/provolone c\/ bacon/g, "provolone e bacon");
    result = result.replace(/salame c\/ bacon/g, "salame e bacon");
    result = result.replace(/toscana c\/ bacon/g, "toscana e bacon");
    result = result.replace(/vegetariana c\/ bacon/g, "vegetariana e bacon");
    result = result.replace(/banana c\/ bacon/g, "banana e bacon");
    result = result.replace(/nevada c\/ bacon/g, "nevada e bacon");
    result = result.replace(/chocoduo c\/ bacon/g, "chocoduo e bacon");
    result = result.replace(/pacoca c\/ bacon/g, "pacoca e bacon");
    result = result.replace(/laka c\/ bacon/g, "laka e bacon");
    result = result.replace(/oreo c\/ bacon/g, "oreo e bacon");
    result = result.replace(/casa c\/ bacon/g, "casa e bacon");
    result = result.replace(/alho c\/ bacon/g, "alho e bacon");
    result = result.replace(/milho c\/ bacon/g, "milho e bacon");
    result = result.replace(/pacoca laka/g, "pacoca e laka");
    result = result
      .replace(/3 queijo/g, "3 queijos")
      .replace(/tres queijo/g, "3 queijos")
      .replace(/4 queijo/g, "4 queijos")
      .replace(/quatro queijo/g, "4 queijos");

    // Verifica se a palavra "especial" está presente na string
    if (result.includes("especial")) {
      // Divide a string em um array de palavras
      let palavras = result.split(" ");

      // Encontra a posição da palavra "especial" no array
      let indiceEspecial = palavras.indexOf("especial");

      // Verifica se há uma palavra após a palavra "especial"
      if (indiceEspecial < palavras.length - 1) {
        // Substitui a palavra seguinte por "e"
        palavras[indiceEspecial + 1] = "e " + palavras[indiceEspecial + 1];
      }

      // Junta o array de palavras de volta em uma string
      result = palavras.join(" ");
      result = result.replace(/ e e /g, " e ");
    }

    if (result.includes("pacoca")) {
      // Divide a string em um array de palavras
      let palavras = result.split(" ");

      // Encontra a posição da palavra "especial" no array
      let indiceEspecial = palavras.indexOf("pacoca");

      // Verifica se há uma palavra após a palavra "especial"
      if (indiceEspecial < palavras.length - 1) {
        // Substitui a palavra seguinte por "e"
        palavras[indiceEspecial + 1] = "e " + palavras[indiceEspecial + 1];
      }

      // Junta o array de palavras de volta em uma string
      result = palavras.join(" ");
      result = result.replace(/ e e /g, " e ");
    }

    if (result.includes("nevada")) {
      // Divide a string em um array de palavras
      let palavras = result.split(" ");

      // Encontra a posição da palavra "especial" no array
      let indiceEspecial = palavras.indexOf("nevada");

      // Verifica se há uma palavra após a palavra "especial"
      if (indiceEspecial < palavras.length - 1) {
        // Substitui a palavra seguinte por "e"
        palavras[indiceEspecial + 1] = "e " + palavras[indiceEspecial + 1];
      }

      // Junta o array de palavras de volta em uma string
      result = palavras.join(" ");
      result = result.replace(/ e e /g, " e ");
    }

    const ocorrencia = result.match(/1\/2/g);

    if (ocorrencia) {
      if (
        ocorrencia.length == 2 &&
        result.indexOf("1/2 alho e 1/2 tomate") !== -1 &&
        result.indexOf("1/2 alho e 1/2 tomate") === 0
      ) {
        result = result.replace(/1\/2 alho e 1\/2 tomate/g, "alho e tomate");
      } else if (
        ocorrencia.length == 3 &&
        result.indexOf("1/2 alho e 1/2 tomate") !== -1 &&
        result.indexOf("1/2 alho e 1/2 tomate") === 0
      ) {
        result = result.replace(
          /1\/2 alho e 1\/2 tomate/g,
          "1/2 alho e tomate e"
        );
      } else if (
        ocorrencia.length == 3 &&
        result.indexOf("1/2 alho e 1/2 tomate") !== -1 &&
        result.indexOf("1/2 alho e 1/2 tomate") > 0
      ) {
        result = result.replace(
          /1\/2 alho e 1\/2 tomate/g,
          "1/2 alho e tomate"
        );
      } else if (
        ocorrencia.length == 3 &&
        result.indexOf("1/2 alho 1/2 tomate") !== -1 &&
        result.indexOf("1/2 alho 1/2 tomate") > 0
      ) {
        result = result.replace(/1\/2 alho 1\/2 tomate/g, "1/2 alho e tomate");
      }
    }
    result = result.replace(/4 queijoss/g, "4 queijos");
    result = result.replace(/3 queijoss/g, "3 queijos");
    result = result.replace(/alho e 1\/2 tomate/g, "e 1/2 alho e tomate");
    result = result.replace(/a moda do pizzaiolo/g, "moda do pizzaiolo");
    return result;
  }
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

module.exports = { corrigirPalavrasParecidas, dados };
