const BaseRoute = require("./base/baseRoute");
const Joi = require("joi");
const Boom = require("boom");
const failAction = (req, head, err) => {
  throw err;
};

const USER = {
  username: "xuxadasilva",
  password: "123",
};

class AuthRoutes extends BaseRoute {
  login() {
    return {
      path: "/login",
      method: "POST",
      config: {
        tags: ["api"],
        description: "Get Token",
        notes: "Login with user and password on db",
        validate: {
          failAction,
          payload: {
            username: Joi.string().required(),
            password: Joi.string().required(),
          },
        },
      },
      handler: async (request) => {
        const { username, password } = request.payload;
        if (
          username.toLowerCase() !== USER.username ||
          password !== USER.password
        )
          return Boom.unauthorized();
      },
    };
  }
}
