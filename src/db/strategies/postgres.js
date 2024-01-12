const ICrud = require("./interfaces/interfaceCrud");
const Sequelize = require("sequelize");

class Postgres extends ICrud {
  constructor() {
    super();
    this._driver = null;
    this._heros = null;
  }

  async isConnected() {
    try {
      await this._driver.authenticate();
      return true;
    } catch (error) {
      console.error("fail conection!", error);
      return false;
    }
  }
  async defineModel() {
    this._heros = await this._driver.define(
      "heros",
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        power: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        tableName: "tb_heros",
        freezeTableName: false,
        timestamps: false,
      }
    );
    await this._heros.sync();
  }
  async connect() {
    this._driver = new Sequelize(
      process.env.POSTGRES_DB,
      process.env.POSTGRES_USER,
      process.env.POSTGRES_PASSWORD,
      {
        host: "localhost",
        dialect: "postgres",
        quoteIdentifiers: 0,
        operatorsAliases: 0,
      }
    );
    await this.defineModel();
  }
  async create(item) {
    const items = await this._heros.create(item);
    return items.dataValues;
  }

  async read(item = {}) {
    return this._heros.findAll({ where: item, raw: true });
  }
  async update(id, item) {
    return await this._heros.update(item, { where: { id: id } });
  }
  async delete(id) {
    const query = id ? { id } : {};
    return await this._heros.destroy({ where: query });
  }
}

module.exports = Postgres;
