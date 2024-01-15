const Mongoose = require("mongoose");
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
try {
  module.exports = Mongoose.model("heros");
} catch (error) {
  module.exports = Mongoose.model("heros", heroSchema);
}
