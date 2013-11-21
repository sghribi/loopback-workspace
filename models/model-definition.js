var app = require('../');
var ModelDefinition = app.models.ModelDefinition;

ModelDefinition.validatesUniquenessOf('name');
ModelDefinition.validatesPresenceOf('name', 'dataSource');

ModelDefinition.afterCreate = function (next) {
  var generator = this.generator();
  if(generator) {
    generator.run(next)
  } else {
    next();
  }
}

ModelDefinition.prototype.generator = function () {
  var base = this.options && this.options.base;
  var generator = null;

  if(base) {
    try {
      generator = require('../generators/' + base.toLowerCase())
    } catch(e) {
      if(e.code !== 'MODULE_NOT_FOUND') {
        throw e;
      }
    }
  }

  return generator;
}
