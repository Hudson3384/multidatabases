require("./test.config");
const assert = require("assert");
const api = require("./../api");
let app = {};
describe.only("Heros Api test", function () {
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
  it("list heros by limit", async () => {
    const LIMIT_SIZE = "AR";
    const result = await app.inject({
      method: "GET",
      url: `/heros?skip=0&limit=${LIMIT_SIZE}`,
    });
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 500);
  });
  it("list heros by name", async () => {
    const name = "Superboy-1705349597385";

    const result = await app.inject({
      method: "GET",
      url: `/heros?skip=0&limit=1&name=${name}`,
    });
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
  });
});
