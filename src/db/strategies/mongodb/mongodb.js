const Mongoose = require("mongoose");
const ICrud = require("../interfaces/interfaceCrud");

const PASSWORD = process.env.MONGO_INITDB_ROOT_USERNAME;
const USERNAME = process.env.MONGO_INITDB_ROOT_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;

const STATUS = {
  0: "Disconnected",
  1: "Connected",
  2: "Connecting",
  3: "Disconnecting",
};

class MongoDB extends ICrud {
  constructor(connection, schema) {
    super();
    this._schema = schema;
    this._connection = connection;
  }
  async isConnected() {
    const state = STATUS[this._connection.readyState];
    if (state === "Connected") return state;
    if (state !== "Connecting") return state;
    const connectedState = await new Promise((resolve) =>
      setTimeout(() => resolve(STATUS[this._connection.readyState]), 1000)
    );
    return connectedState;
  }
  static async connect() {
    try {
      Mongoose.connect(
        `mongodb://${USERNAME}:${PASSWORD}@localhost:27017/${MONGO_DB}`
      );
      const connection = Mongoose.connection;
      connection.once("open", () => console.log("Database connected"));
      return connection;
    } catch (error) {
      console.error("Conection fail", error);
    }
  }
  create(item) {
    return this._schema.create(item);
  }
  read(query, skip = 0, limit = 10) {
    return this._schema.find(query).skip(skip).limit(limit);
  }
  update(id, newItem) {
    return this._schema.updateOne({ _id: id }, { $set: newItem });
  }
  delete(id) {
    return this._schema.deleteOne({ _id: id });
  }
  async disconnect() {
    return await this._schema.close();
  }
}

module.exports = MongoDB;
