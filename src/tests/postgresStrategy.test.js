require("./test.config");
const assert = require("assert");
const Postgres = require("../db/strategies/postgres");
const Context = require("../db/strategies/base/contextStrategy");

const context = new Context(new Postgres());
const MOCK_HERO_CREATE = {
  name: "Gaviao negro",
  power: "arrows",
};
describe("postgres strategy", function () {
  this.timeout(Infinity);
  this.beforeAll(async () => {
    await context.connect();
  });
  it("PostgresSQL Connection", async function () {
    const result = await context.isConnected();
    assert.equal(result, true);
  });
  it("create", async function () {
    const result = await context.create(MOCK_HERO_CREATE);
    delete result.id;
    assert.deepEqual(result, MOCK_HERO_CREATE);
  });
  it("list", async function () {
    const [result] = await context.read({
      name: MOCK_HERO_CREATE.name,
    });
    delete result.id;
    assert.deepEqual(result, MOCK_HERO_CREATE);
  });
});
