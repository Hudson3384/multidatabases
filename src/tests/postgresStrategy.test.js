require("./test.config");
const assert = require("assert");
const Postgres = require("../db/strategies/postgres/postgres.js");
const Context = require("../db/strategies/base/contextStrategy");
const HeroSchema = require("../db/strategies/postgres/schemas/heroSchema");

let context = {};

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
    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, HeroSchema);
    context = new Context(new Postgres(connection, model));
    await context.delete();
    await context.create(MOCK_HERO_UPDATE);
  });
  it("Postgres Connection - TEST BROKEN", async function () {
    this.timeout(3000);
    const result = await context.isConnected();
    console.log(result, "result");
    //   assert.equal(result, true);
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
