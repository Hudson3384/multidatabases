const BaseRoute = require("./base/baseRoute");
const Joi = require("joi");
const failAction = (req, head, err) => {
  throw err;
};

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }
  list() {
    return {
      path: "/heros",
      method: "GET",
      config: {
        validate: {
          failAction,
          query: {
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            name: Joi.string().min(3).max(100),
          },
        },
      },
      handler: async (request, headers) => {
        try {
          const { skip, limit, name } = request.query;
          let query = name ? { name: { $regex: `.*${name}*.` } } : {};
          const result = await this.db.read(query, skip, limit);
          return headers.response(result).code(200);
        } catch (error) {
          return headers.response(`Internal Error, ${error}`).code(500);
        }
      },
    };
  }
  create() {
    return {
      path: "/heros",
      method: "POST",
      config: {
        validate: {
          failAction,
          payload: {
            name: Joi.string().required().min(3).max(100),
            power: Joi.string().required().min(2).max(15),
          },
        },
      },
      handler: async (request) => {
        try {
          const { name, power } = request.payload;
          const result = await this.db.create({ name, power });
          return {
            message: "Hero Created",
            _id: result._id,
          };
        } catch (err) {
          console.error("Fail on Post hero", err);
          return "Internal Error";
        }
      },
    };
  }
}

module.exports = HeroRoutes;
