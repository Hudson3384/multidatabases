require("./test.config");
const assert = require("assert");
const Mongo = require("../db/strategies/mongodb");
const Context = require("../db/strategies/base/contextStrategy");

let MOCK_HERO_ID;

const MOCK_HEROS_CREATE = {
  name: "Wonder Woman",
  power: "Strong",
};

const MOCK_HEROS_DEFAULT = {
  name: `Superboy-${Date.now()}`,
  power: "FanService",
};

const MOCK_HEROS_UPDATE = {
  name: `SuperShock-${Date.now()}`,
  power: "Shock",
};

const context = new Context(new Mongo());

describe("MongoDB strategy", async function () {
  this.beforeAll(async () => {
    await context.connect();
  });
  it("MongoDB Connection", async function () {
    const result = await context.isConnected();
    assert.deepEqual(result, 1);
  });
  it("create register", async () => {
    const { name, power } = await context.create(MOCK_HEROS_CREATE);
    assert.deepEqual({ name, power }, MOCK_HEROS_CREATE);
  });
  it("list", async () => {
    await context.create(MOCK_HEROS_DEFAULT);
    const [{ name, power }] = await context.read({
      name: MOCK_HEROS_DEFAULT.name,
    });
    assert.deepEqual({ name, power }, MOCK_HEROS_DEFAULT);
  });
  it("update", async () => {
    MOCK_HERO_ID = await context.create(MOCK_HEROS_UPDATE).then((e) => e._id);
    const result = await context.update(MOCK_HERO_ID, {
      name: "Geladeira",
    });
    assert.deepEqual(result.modifiedCount, 1);
  });
  it("delete", async () => {});
  const result = await context.delete(MOCK_HERO_ID);
  assert.deepEqual(result.n, 1);
});
