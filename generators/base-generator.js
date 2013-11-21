/*
 * Export BaseGenerator
 */

module.exports = BaseGenerator;

/*
 * Module Dependencies.
 */

var yeoman = require('yeoman-generator');
var util = require('util');
var path = require('path');

/*
 * Create a generator with the given args options and config.
 */

function BaseGenerator(args, options, config) {
  yeoman.generators.Base.call(this, args, options, config);

  this.sourceRoot(path.join(__dirname, 'template'));
}

/*
 * Inherit from the base yeoman generator.
 */

util.inherits(BaseGenerator, yeoman.generators.Base);
