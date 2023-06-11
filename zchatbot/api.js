const axios = require("axios");

const api = axios.create({
  baseURL: "http://localhost:3000",
  // baseURL: "https://database-primo.up.railway.app",
  timeout: 15000,
});

module.exports = { api };
