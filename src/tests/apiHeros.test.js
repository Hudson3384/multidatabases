require("./test.config");
const assert = require("assert");
const api = require("./../api");
const MOCK_HERO_CREATE = {
  name: "Chapolin colorado",
  power: "Marreta biônica",
};
let app = {};
describe("Heros Api test", function () {
  this.beforeAll(async () => {
    app = await api;
  });

  this.afterAll(async () => {
    app.stop();
  });
  it("list heros", () => async () => {
    const result = await app.inject({
      method: "GET",
      url: "/heros",
    });
    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);
    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(data));
  });
  it("Error - list heros by limit", async () => {
    const LIMIT_SIZE = "AR";
    const result = await app.inject({
      method: "GET",
      url: `/heros?skip=0&limit=${LIMIT_SIZE}`,
    });
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 400);
  });
  it("list heros by name", async () => {
    const name = "Superboy-1705349597385";

    const result = await app.inject({
      method: "GET",
      url: `/heros?skip=0&limit=10000&name=${name}`,
    });
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.deepEqual(result.result[0].name, name);
  });
  it("create heros - POST /heros", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/heros",
      payload: MOCK_HERO_CREATE,
    });
    const statusCode = result.statusCode;
    const { message, _id } = JSON.parse(result.payload);
    assert.ok(statusCode === 200);
    assert.deepEqual(message, "Hero Created");
    assert.notStrictEqual(_id, undefined);
  });
});
