const { api } = require("./api");

class Requests {
  static async recuperarEtapa(msg) {
    let final = msg.from.slice(msg.from.length - 4);
    if (final === "c.us") {
      let response = await api.get(`/etapas/${msg.from}`);
      if (response.data === null) {
        let responsePost = await api.post(`/etapas`, {
          telefone: msg.from,
          etapa: "a",
        });

        return responsePost.data;
      }
      return response.data;
    }
  }

  static async atualizarEtapa(from, body) {
    const response = await api.patch(`/etapas/${from}`, body);

    return response.data;
  }

  static async recuperarTempo() {
    let response = await api.get(`/tempo`);
    return response.data;
  }

  static async criarPedido(body) {
    let response = await api.post(`/pedidos`, body);
    return response.data;
  }

  static async atualizarPedido(data) {
    let response = await api.patch(`/pedidos`, data);
    return response.data;
  }

  static async recuperarPedido(from) {
    let response = await api.get(`/pedidos/recuperar/${from}`);
    return response.data;
  }
}

module.exports = { Requests };
