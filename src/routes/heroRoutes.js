const BaseRoute = require("./base/baseRoute");
const Joi = require("joi");
const Boom = require("boom");
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
        tags: ["api"],
        description: "List heros",
        notes: "Pagination results and filter by name",
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
        tags: ["api"],
        description: "Create Hero",
        notes: "Create Hero by name and power",
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
  update() {
    return {
      path: "/heros/{id}",
      method: "PATCH",
      config: {
        tags: ["api"],
        description: "Update hero by id",
        notes: "Update name and/or power",
        validate: {
          failAction,
          params: {
            id: Joi.string().required(),
          },
          payload: {
            name: Joi.string().min(2).max(100),
            power: Joi.string().min(2).max(100),
          },
        },
      },
      handler: async (request) => {
        try {
          const { id } = request.params;
          const { payload } = request;
          const dataString = JSON.stringify(payload);
          const data = JSON.parse(dataString);
          const result = await this.db.update(id, data);
          if (result.modifiedCount !== 1) {
            return { message: "It not possible to update the hero" };
          } else {
            return { message: "Hero updated with success" };
          }
        } catch (err) {
          console.log(err);
          return "Internal Error on PATCH /heros";
        }
      },
    };
  }
  delete() {
    return {
      path: "/heros/{id}",
      method: "DELETE",
      config: {
        tags: ["api"],
        description: "Delete hero by id",
        notes: "Delete user on database",
        validate: {
          failAction,
          params: {
            id: Joi.string().required(),
          },
        },
      },
      handler: async (request) => {
        try {
          const { id } = request.params;
          const result = await this.db.delete(id);
          if (result.deletedCount !== 1) {
            return { message: "It not possible to delete the hero" };
          }
          return { message: "Hero deleted with success" };
        } catch (err) {
          console.error(err);
          return Boom.internal();
        }
      },
    };
  }
}

module.exports = HeroRoutes;
