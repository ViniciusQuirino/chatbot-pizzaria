{ id: 5, nome: 'atum', grande: 38, media: 34 },
{ id: 6, nome: 'atum especial', grande: 41, media: 37 },
{ id: 1, nome: 'a moda', grande: 45, media: 40 },
{ id: 24, nome: 'moda do pizzaiolo', grande: 45, media: 40 },
{ id: 41, nome: 'banana', grande: 32, media: 30 },
{ id: 42, nome: 'banana nevada', grande: 36, media: 32 },

else if (
    // Verificar se a próxima palavra começa com "c" e não tem "/" no final
    i + 1 < palavrasFrase.length &&
    palavrasFrase[i + 1].startsWith("c") &&
    !palavrasFrase[i + 1].endsWith("/")
  ) {
    palavraCorrigida = melhorCorrespondencia + " c/";
  } else if (
    // Verificar se a próxima palavra começa com "c" e não tem "/" no final
    i + 1 < palavrasFrase.length &&
    palavrasFrase[i + 1].startsWith("com") &&
    !palavrasFrase[i + 1].endsWith("/")
  ) {
    palavraCorrigida = melhorCorrespondencia + " c/";
  } else if (
    // Verificar se a próxima palavra começa com "c" e não tem "/" no final
    i + 1 < palavrasFrase.length &&
    palavrasFrase[i + 1].startsWith("cm") &&
    !palavrasFrase[i + 1].endsWith("/")
  ) {
    palavraCorrigida = melhorCorrespondencia + " c/";
  } else if (
    // Verificar se a próxima palavra começa com "c" e não tem "/" no final
    i + 1 < palavrasFrase.length &&
    palavrasFrase[i + 1].startsWith("om") &&
    !palavrasFrase[i + 1].endsWith("/")
  ) {
    palavraCorrigida = melhorCorrespondencia + " c/";
  } 


  else if (
    // Verificar se a próxima palavra começa com "c" e não tem "/" no final
    i + 1 < palavrasFrase.length &&
    palavrasFrase[i + 1].startsWith("c") &&
    !palavrasFrase[i + 1].endsWith("/")
  ) {
    palavraCorrigida = melhorCorrespondencia + " c/";
  } else if (
    // Verificar se a próxima palavra começa com "c" e não tem "/" no final
    i + 1 < palavrasFrase.length &&
    palavrasFrase[i + 1].startsWith("com") &&
    !palavrasFrase[i + 1].endsWith("/")
  ) {
    palavraCorrigida = melhorCorrespondencia + " c/";
  } else if (
    // Verificar se a próxima palavra começa com "c" e não tem "/" no final
    i + 1 < palavrasFrase.length &&
    palavrasFrase[i + 1].startsWith("cm") &&
    !palavrasFrase[i + 1].endsWith("/")
  ) {
    palavraCorrigida = melhorCorrespondencia + " c/";
  } else if (
    // Verificar se a próxima palavra começa com "c" e não tem "/" no final
    i + 1 < palavrasFrase.length &&
    palavrasFrase[i + 1].startsWith("om") &&
    !palavrasFrase[i + 1].endsWith("/")
  ) {
    palavraCorrigida = melhorCorrespondencia + " c/";
  } 

  const result = string.replace(
    / c|c | c |com|com | com |om | om | om|cm | cm | cm|c\/ om|c\/ cm|c\/ com|c\/ c/g,
    " c/"
  );


  result = string.replace(/cm|om|c|com/g, " c/ "); //0 espaço
  result = string.replace(/ cm | om | c | com /g, " c/ "); //1 espaço
  result = string.replace(/  cm  |  om  |  c  |  com  /g, " c/ "); //2 espaço
  result = string.replace(/   cm   |   om   |   c   |   com   /g, " c/ "); // 3 espaço
  result = string.replace(/   cm   |   om   |   c   |   com   /g, " c/ "); // 3 espaço

  // if (chamadaFeita) {
  //   // Se a chamada já foi feita, retorne o resultado original
  //   return result;
  // }
  // // Marque a chamada como feita
  // chamadaFeita = true;

  // // Faça o processamento necessário
  // const aa = corrigirPalavrasParecidas(result);

  // // Retorne o resultado
  // return aa;