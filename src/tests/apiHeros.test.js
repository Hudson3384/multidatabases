require("./test.config");
const assert = require("assert");
const api = require("./../api");
const MOCK_HERO_CREATE = {
  name: "Chapolin colorado",
  power: "Marreta biônica",
};

const MOCK_HERO_INITIAL = {
  name: "Captain America",
  power: "Shield",
};

let MOCK_ID = "";
let MOCK_ID_DELETE = "";
let app = {};

describe("Heros Api test", function () {
  this.beforeAll(async () => {
    app = await api;
    const result = await app.inject({
      method: "POST",
      url: "/heros",
      payload: MOCK_HERO_CREATE,
    });
    MOCK_ID = JSON.parse(result.payload)._id;
    const result2 = await app.inject({
      method: "POST",
      url: "/heros",
      payload: MOCK_HERO_INITIAL,
    });
    MOCK_ID_DELETE = JSON.parse(result2.payload)._id;
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
  it("Update hero - PATCH /hero/:id ", async () => {
    const _id = MOCK_ID;
    const expected = {
      power: "Shield",
    };

    const result = await app.inject({
      method: "PATCH",
      url: `/heros/${_id}`,
      payload: JSON.stringify(expected),
    });

    const data = JSON.parse(result.payload);
    assert.ok(result.statusCode === 200);
    assert.deepEqual(data.message, "Hero updated with success");
  });

  it("Update hero fails on Incorrect ID - PATCH /hero/:id ", async () => {
    const _id = `111111111111111111111111`;
    const expected = {
      power: "Shield",
    };

    const result = await app.inject({
      method: "PATCH",
      url: `/heros/${_id}`,
      payload: JSON.stringify(expected),
    });

    const data = JSON.parse(result.payload);
    assert.ok(result.statusCode === 200);
    assert.deepEqual(data.message, "It not possible to update the hero");
  });

  it("Delete item - /hero/:id", async () => {
    const result = await app.inject({
      method: "DELETE",
      url: `/heros/${MOCK_ID_DELETE}`,
    });
    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);
    assert.ok(statusCode === 200);
    assert.deepEqual(data.message, "Hero deleted with success");
  });
});
