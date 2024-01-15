const ICrud = require("../interfaces/interfaceCrud");
const Sequelize = require("sequelize");

class Postgres extends ICrud {
  constructor(connection, schema) {
    super();
    this._connnection = connection;
    this._schema = schema;
  }

  async isConnected() {
    try {
      await this._connection.authenticate();
      console.log(this._connnection, this._schema);
      return true;
    } catch (error) {
      console.error("fail conection!", error);
      return false;
    }
  }
  static async defineModel(connection, schema) {
    const model = connection.define(schema.name, schema.schema, schema.options);
    await model.sync();
    return model;
  }
  static async connect() {
    const sequelize = new Sequelize(
      process.env.POSTGRES_DB,
      process.env.POSTGRES_USER,
      process.env.POSTGRES_PASSWORD,
      {
        host: "localhost",
        dialect: "postgres",
        quoteIdentifiers: 0,
        operatorsAliases: 0,
        logging: false,
      }
    );
    return sequelize;
  }
  async create(item) {
    const items = await this._schema.create(item);
    return items.dataValues;
  }

  async read(item = {}) {
    return this._schema.findAll({ where: item, raw: true });
  }
  async update(id, item) {
    return await this._schema.update(item, { where: { id: id } });
  }
  async delete(id) {
    const query = id ? { id } : {};
    return await this._schema.destroy({ where: query });
  }
}

module.exports = Postgres;
