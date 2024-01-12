require("./test.config");
const assert = require("assert");
const Postgres = require("../db/strategies/postgres");
const Context = require("../db/strategies/base/contextStrategy");

const context = new Context(new Postgres());
const MOCK_HERO_CREATE = {
  name: "Gaviao negro",
  power: "arrows",
};
const MOCK_HERO_UPDATE = {
  name: "He-man",
  power: "Steroids",
};

describe("postgres strategy", function () {
  this.timeout(Infinity);
  this.beforeAll(async () => {
    await context.connect();
    await context.delete();
    await context.create(MOCK_HERO_UPDATE);
  });
  it("PostgresSQL Connection", async function () {
    const result = await context.isConnected();
    assert.equal(result, true);
  });
  it("Create Item", async function () {
    const result = await context.create(MOCK_HERO_CREATE);
    delete result.id;
    assert.deepEqual(result, MOCK_HERO_CREATE);
  });
  it("List an/all item(s)", async function () {
    const [result] = await context.read({
      name: MOCK_HERO_CREATE.name,
    });
    delete result.id;
    assert.deepEqual(result, MOCK_HERO_CREATE);
  });
  it("Update an item", async function () {
    const [resultToUpdate] = await context.read({
      name: MOCK_HERO_UPDATE.name,
    });
    const newItem = {
      ...MOCK_HERO_UPDATE,
      name: "Wonder Woman",
    };
    await context.update(resultToUpdate.id, newItem);
    const [result] = await context.read({
      id: resultToUpdate.id,
    });
    assert.deepEqual(result.name, newItem.name);
  });
  it("delete an item", async function () {
    const [item] = await context.read();
    const result = await context.delete(item.id);
    assert.deepEqual(result, 1);
  });
});
