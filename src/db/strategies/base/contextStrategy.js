const ICrud = require("./../interfaces/interfaceCrud");

class ContextStrategy extends ICrud {
  constructor(strategy) {
    super();
    this._database = strategy;
  }

  static connect() {
    return this._database.connect();
  }
  create(item, skip, limit) {
    return this._database.create(item, skip, limit);
  }
  read(item) {
    return this._database.read(item);
  }
  update(id, item) {
    return this._database.update(id, item);
  }
  delete(id) {
    return this._database.delete(id);
  }
  isConnected() {
    return this._database.isConnected();
  }
}

module.exports = ContextStrategy;
