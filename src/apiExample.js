const Hapi = require("@hapi/hapi");
const Context = require("./db/strategies/base/contextStrategy");
const Mongodb = require("./db/strategies/mongodb/mongodb");
const HeroSchema = require("./db/strategies/mongodb/schemas/heroSchema");
const app = new Hapi.Server({
  port: 5000,
});

async function main() {
  const connection = Mongodb.connect();
  const context = new Context(new Mongodb(connection, HeroSchema));
  app.route([
    {
      path: "/heros",
      method: "GET",
      handler: (request, head) => {
        return context.read();
      },
    },
  ]);
  await app.start();
  console.log("Server runing");
}

main();
