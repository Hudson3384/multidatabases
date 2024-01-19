const Hapi = require("@hapi/hapi");
const Context = require("./db/strategies/base/contextStrategy");
const Mongodb = require("./db/strategies/mongodb/mongodb");
const Joi = require("joi");
const HeroSchema = require("./db/strategies/mongodb/schemas/heroSchema");
const HeroRoutes = require("./routes/heroRoutes");

const HapiSwagger = require("hapi-swagger");
const Vision = require("@hapi/vision");
const Inert = require("@hapi/inert");

const swaggerOptions = {
  info: {
    title: "API Heros - Documentation",
    version: "1.0.0",
  },
};

const app = new Hapi.Server({
  port: 1234,
});

function mapRoutes(instance, methods) {
  new HeroRoutes()["list"]();
  return methods.map((method) => instance[method]());
}

async function main() {
  const connection = Mongodb.connect();
  const context = new Context(new Mongodb(connection, HeroSchema));
  await app.register([
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  app.validator(Joi);
  app.route(mapRoutes(new HeroRoutes(context), HeroRoutes.methods()));
  await app.start();
  return app;
}

module.exports = main();
