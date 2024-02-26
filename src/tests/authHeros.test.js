const assert = require("assert");
const api = require("../api");
let app;

describe.only("Auth test", function () {
  this.beforeAll(async () => {
    app = await api;
  });

  this.afterAll(async () => {
    if (app) {
      await app.stop();
    }
  });
  it("get a token", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: {
        username: "Xuxadasilva",
        password: "123",
      },
    });
    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);
    assert.ok(statusCode === 200);
    assert.ok(data.token.length > 10);
  });
});
