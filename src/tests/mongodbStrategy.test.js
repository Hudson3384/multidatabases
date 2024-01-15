require("./test.config");
const assert = require("assert");
const MongodB = require("../db/strategies/mongodb/mongodb");
const HeroSchema = require("../db/strategies/mongodb/schemas/heroSchema");
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

let context = {};

describe("MongoDB strategy", async function () {
  this.beforeAll(async () => {
    const connection = await MongodB.connect();
    context = new Context(new MongodB(connection, HeroSchema));
  });
  it("MongoDB Connection", async function () {
    const result = await context.isConnected();
    assert.deepEqual(result, "Connected");
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
