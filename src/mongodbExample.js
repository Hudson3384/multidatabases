// npm install mongoose
const Mongoose = require("mongoose");

const PASSWORD = process.env.MONGO_INITDB_ROOT_USERNAME;
const USERNAME = process.env.MONGO_INITDB_ROOT_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;

Mongoose.connect(
  `mongodb://${USERNAME}:${PASSWORD}@localhost:27017/${MONGO_DB}`
).catch((error) =>
  console.error("Conection fail", PASSWORD, USERNAME, MONGO_DB, error)
);

const connection = Mongoose.connection;
connection.once("open", () => console.log("Database connected"));

//const state = connection.readyState();
//console.log("state", state);

/*
  0: Disconnected 
  1: Connected
  2: Connecting
  3: Disconnecting
 */

const heroSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  power: {
    type: String,
    required: true,
  },
  insertedAt: {
    type: Date,
    default: new Date(),
  },
});

const model = Mongoose.model("hero", heroSchema);

async function main() {
  const result = await model.create({
    name: "Batman",
    power: "Money",
  });
  const list = await model.find();
}
