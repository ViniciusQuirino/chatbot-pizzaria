const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const { phoneNumberFormatter } = require("./helpers/formatter");
const { body, validationResult } = require("express-validator");
const fileUpload = require("express-fileupload");
const socketIO = require("socket.io");
const mime = require("mime-types");
const express = require("express");
const qrcode = require("qrcode");
const axios = require("axios");
const http = require("http");
const fs = require("fs");
const { Requests } = require("./zchatbot/requests");
const { pedidos } = require("./zchatbot/pedido");
const { maisDeUma } = require("./zchatbot/todas.grandes");
const { grandeEMedia } = require("./zchatbot/grande.media");
const {
  listarPizzas,
  audio,
  ativarchatbot,
  desativarchatbot,
} = require("./zchatbot/scripts");
const { atualizarPizza } = require("./zchatbot/atualizar.pizza");

const port = process.env.PORT || 7005;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  fileUpload({
    debug: true,
  })
);

app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: __dirname,
  });
});

const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  },
  authStrategy: new LocalAuth(),
});

client.on("message", async (msg) => {
  let recuperarEtapa = await Requests.recuperarEtapa(msg);

  const date = new Date();
  const h = date.getHours();

  if (
    (recuperarEtapa !== undefined &&
      recuperarEtapa.ativado == true &&
      msg.from == "5514998760815@c.us") ||
    // msg.from == "5514996056869@c.us" ||
    // msg.from == "5514991342480"
    msg.from == "5514998593589@c.us"
  ) {
    const message = msg.body.toLowerCase();
    let desativar = message.slice(0, 9);
    let ativar = message.slice(0, 6);
    if (ativar != "ativar" && desativar != "desativar" && h >= 5 && h < 23) {
      if (msg.mediaKey != undefined && recuperarEtapa !== "comp") {
        audio(msg.from, client);
      }
      pedidos(recuperarEtapa, msg, client);
      listarPizzas(msg, client);
      atualizarPizza(msg, client);
      if (
        recuperarEtapa.etapa == "1" ||
        recuperarEtapa.etapa == "2" ||
        recuperarEtapa.etapa == "3" ||
        recuperarEtapa.etapa == "4" ||
        recuperarEtapa.etapa == "20" ||
        recuperarEtapa.etapa == "21" ||
        recuperarEtapa.etapa == "22" ||
        recuperarEtapa.etapa == "23" ||
        recuperarEtapa.etapa == "24"
      ) {
        maisDeUma(recuperarEtapa, msg, client);
        grandeEMedia(recuperarEtapa, msg, client);
      }
    }
    ativarchatbot(msg, client);
    desativarchatbot(msg, client);
  }
});

client.initialize();

// Socket IO
io.on("connection", function (socket) {
  socket.emit("message", "Connecting...");

  client.on("qr", (qr) => {
    console.log("QR RECEIVED", qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit("qr", url);
      socket.emit("message", "QR Code received, scan please!");
    });
  });

  client.on("ready", () => {
    socket.emit("ready", "Whatsapp is ready!");
    socket.emit("message", "Whatsapp is ready!");
  });

  client.on("authenticated", () => {
    socket.emit("authenticated", "Whatsapp is authenticated!");
    socket.emit("message", "Whatsapp is authenticated!");
    console.log("AUTHENTICATED");
  });

  client.on("auth_failure", function (session) {
    socket.emit("message", "Auth failure, restarting...");
  });

  client.on("disconnected", (reason) => {
    socket.emit("message", "Whatsapp is disconnected!");
    client.destroy();
    client.initialize();
  });
});

const checkRegisteredNumber = async function (number) {
  const isRegistered = await client.isRegisteredUser(number);
  return isRegistered;
};

// Send message
app.post(
  "/send-message",
  [body("number").notEmpty(), body("message").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req).formatWith(({ msg }) => {
      return msg;
    });

    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: errors.mapped(),
      });
    }

    const number = phoneNumberFormatter(req.body.number);
    const message = req.body.message;

    const isRegisteredNumber = await checkRegisteredNumber(number);

    if (!isRegisteredNumber) {
      return res.status(422).json({
        status: false,
        message: "The number is not registered",
      });
    }

    client
      .sendMessage(number, message)
      .then((response) => {
        res.status(200).json({
          status: true,
          response: response,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: false,
          response: err,
        });
      });
  }
);

// Send media
app.post("/send-media", async (req, res) => {
  const number = phoneNumberFormatter(req.body.number);
  const caption = req.body.caption;
  const fileUrl = req.body.file;

  // const media = MessageMedia.fromFilePath('./image-example.png');
  // const file = req.files.file;
  // const media = new MessageMedia(file.mimetype, file.data.toString('base64'), file.name);
  let mimetype;
  const attachment = await axios
    .get(fileUrl, {
      responseType: "arraybuffer",
    })
    .then((response) => {
      mimetype = response.headers["content-type"];
      return response.data.toString("base64");
    });

  const media = new MessageMedia(mimetype, attachment, "Media");

  client
    .sendMessage(number, media, {
      caption: caption,
    })
    .then((response) => {
      res.status(200).json({
        status: true,
        response: response,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        response: err,
      });
    });
});

server.listen(port, function () {
  console.log("App running on *: http://localhost:" + port);
});

// else if (h >= 23) {
//   client.sendMessage(
//     msg.from,
//     `Olá, a Pizzas Primo Delivery agradece sua mensagem🙏! Atendimento de Seg á Sab, das 18 às 23hrs .. 😉`
//   );
// } else if (h >= 0 && h < 6) {
//   client.sendMessage(
//     msg.from,
//     `Olá, a Pizzas Primo Delivery agradece sua mensagem🙏! Atendimento de Seg á Sab, das 18 às 23hrs .. 😉`
//   );
// }
