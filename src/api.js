const Hapi = require("@hapi/hapi");
const Context = require("./db/strategies/base/contextStrategy");
const Mongodb = require("./db/strategies/mongodb/mongodb");
const HeroSchema = require("./db/strategies/mongodb/schemas/heroSchema");
const HeroRoutes = require("./routes/heroRoutes");

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
  app.route([...mapRoutes(new HeroRoutes(context), HeroRoutes.methods())]);
  await app.start();
  return app;
}

module.exports = main();
