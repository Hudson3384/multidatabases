const ICrud = require("./interfaces/interfaceCrud");

class MongoDB extends ICrud {
  constructor() {
    super();
  }
  create(item) {
    console.log("Item Implemented on MongoDB");
  }
}

module.exports = MongoDB;
