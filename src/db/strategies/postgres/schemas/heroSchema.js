const Sequelize = require("sequelize");
const HeroSchema = {
  name: "heros",
  schema: {
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
  options: {
    tableName: "tb_heros",
    freezeTableName: false,
    timestamps: false,
  },
};

module.exports = HeroSchema;
