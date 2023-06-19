const Fuse = require("fuse.js");
const { dados } = require("./corrigir.palavras");

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
  frase = frase.replace(/1\/2/g, "");
  frase = frase.replace(/\s+/g, " ");
  console.log(frase)
  const objetosEncontrados = encontrarObjetos(frase);

  if (objetosEncontrados.length > 0) {
    const nomesEncontrados = objetosEncontrados.map((objeto) => objeto.nome);
    const regexNomes = new RegExp(nomesEncontrados.join("|"), "g");
    let fraseCorrigida = frase.replace(regexNomes, (match) => `"${match}"`);

    // Adicionar vírgula entre os nomes encontrados
    fraseCorrigida = fraseCorrigida.replace(/" "/g, ", ");

    // Remover todas as aspas (simples e duplas)
    fraseCorrigida = fraseCorrigida.replace(/['"]+/g, "");
    fraseCorrigida = fraseCorrigida.replace(
      /a moda da casa,/g,
      "a moda da casa"
    );

    fraseCorrigida = fraseCorrigida.replace(
      /a moda da casa/g,
      "a moda da casa,"
    );

    fraseCorrigida = fraseCorrigida.trim();

    return fraseCorrigida;
  }

  return frase;
}

module.exports = { corrigirFrase };
