const Sequelize = require("sequelize");
const driver = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
    quoteIdentifiers: false,
    operatorsAliases: 0,
  }
);

async function main() {
  const Heros = driver.define(
    "heros",
    {
      id: {
        type: Sequelize.INTEGER,
        required: true,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        required: true,
      },
      power: {
        type: Sequelize.STRING,
        required: true,
      },
    },
    {
      tableName: "tb_heros",
      freezeTableName: false,
      timestamps: false,
    }
  );

  await Heros.sync();

  await Heros.create({
    name: "Lanterna verde",
    power: "Ring",
  });
  const result = await Heros.findAll({
    raw: true,
    attributes: ["name"],
  });
  console.log("result", result);
}

main();
