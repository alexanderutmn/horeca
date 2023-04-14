const http = require("http");
const https = require("https");
const fs = require("fs");
const { MongoClient } = require("mongodb");
const config = require(`../../config/${process.env.NODE_ENV}.config.json`);
const mongoose = require("mongoose");
const redisAdapter = require("socket.io-redis");
const credentials = require("./credentials");

mongoose.connection.on("error", (err) =>
  console.log("Mongoose Connection ERROR: " + err.message)
);
mongoose.connection.once("open", () => console.log("MongoDB Connected!"));
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

require("./mongoose/telegramUserSchema.js");
require("./mongoose/menuSchema.js");


const PORT = process.env.PORT || config.app.port || 8888,
  HOST = process.env.HOSTNAME || config.app.host || "localhost",
  clientD = process.env.DB_CLIENT || config.db.client || "mongodb",
  host = process.env.DB_HOST || config.db.connection.host || "localhost",
  port = process.env.DB_PORT || config.db.connection.port || "27017",
  dbName = process.env.DB_NAME || config.db.connection.dbName || "SYSTEM",
  url = `${clientD}://${host}:${port}/${dbName}`;

(async () => {
  const options = { useUnifiedTopology: true, useNewUrlParser: true };
  const clientMongoose = await mongoose.connect(url, options);
  var optionsSchema = mongoose.model("optionsSchema");

  var optionsApp = await optionsSchema.findOne({ _id: "entityId" }).lean();

  optionsSchema.watch().on("change", async (data) => {
    global.CONFIG_APP = await optionsSchema.findOne({ _id: "entityId" }).lean();
  });

  // define global client, fast work speed
  global.dbClientMongoose = clientMongoose;
  global.CONFIG_APP = optionsApp;

  // MONGO ON WINDOWS LOAD SO BAD, we deal connection on start app
  async function listenCallback() {
    try {
      process.send("ready");
    } catch (err) {
      console.log(err);
    } finally {
      console.log(`Server started at: http://${HOST}:${PORT}`);
    }
  }

  var server;
  if (credentials === false) {
    server = require("./app").listen(PORT, HOST, listenCallback);
  } else {
    server = https
      .createServer(credentials, require("./app"))
      .listen(PORT, HOST, listenCallback);
    //server = require('./app').listen(PORT, HOST, listenCallback);
  }

  const io = (module.exports.io = require("socket.io")(server, {
    transports: ["websocket"],
  }));
  const socketManager = require("./socket");
  io.adapter(redisAdapter({ host: "localhost", port: 6379 }));
  io.on("connection", socketManager);
})();

process.on("SIGINT", async () => {
  console.log("Received SIGINT.  Press Control-D to exit.");
  await global.dbClientMongoose.connection.close();
  process.exit(0);
});

process.on("message", async (msg) => {
  if (msg === "shutdown") {
    console.log("Closing all connections...");
    await global.dbClientMongoose.connection.close();
    process.exit(0);
  }
});
