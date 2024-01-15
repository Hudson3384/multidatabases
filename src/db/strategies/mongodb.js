const Mongoose = require("mongoose");
const ICrud = require("./interfaces/interfaceCrud");

const PASSWORD = process.env.MONGO_INITDB_ROOT_USERNAME;
const USERNAME = process.env.MONGO_INITDB_ROOT_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;

class MongoDB extends ICrud {
  constructor() {
    super();
    this._driver = null;
    this._heros = null;
  }
  async isConnected() {
    const state = this._driver.readyState;
    if (state === 1) return true;
    return await new Promise((_) =>
      setTimeout(() => this._driver.readyState, 2000)
    );
  }
  async defineModel() {
    let heroSchema = new Mongoose.Schema({
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
    try {
      this._heros = Mongoose.model("heros");
    } catch (error) {
      this._heros = Mongoose.model("heros", heroSchema);
    }
  }
  async connect() {
    await Mongoose.connect(
      `mongodb://${USERNAME}:${PASSWORD}@localhost:27017/${MONGO_DB}`
    )
      .then(() => {
        this.defineModel();
        const connection = Mongoose.connection;
        this._driver = connection;
        connection.once("open", () => console.log("Database connected"));
      })
      .catch((error) => console.error("Conection fail", error));
  }
  create(item) {
    return this._heros.create(item);
  }
  read(query, skip = 0, limit = 10) {
    return this._heros.find(query).skip(skip).limit(limit);
  }
  update(id, newItem) {
    return this._heros.updateOne({ _id: id }, { $set: newItem });
  }
  delete(id) {
    return this._heros.deleteOne({ _id, id });
  }
  async disconnect() {
    return await this._heros.close();
  }
}

module.exports = MongoDB;
