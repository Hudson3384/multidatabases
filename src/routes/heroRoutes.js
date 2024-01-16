const BaseRoute = require("./base/baseRoute");

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }
  list() {
    return {
      path: "/heros",
      method: "GET",
      handler: async (request, headers) => {
        try {
          const { skip, limit, name } = request.query;
          let query = {};
          if (name) query.name = name;
          if (isNaN(skip)) throw Error("Skip Type is incorrect");
          if (isNaN(limit)) throw Error("limit Type is incorrect");
          const result = await this.db.read(
            query,
            parseInt(skip),
            parseInt(limit)
          );
          return headers.response(result).code(200);
        } catch (error) {
          return headers.response(`Internal Error, ${error}`).code(500);
        }
      },
    };
  }
}

module.exports = HeroRoutes;
