/*
 * UserGenerator is a Yeoman generator for User model definitions.
 */

var path = require('path');
var util = require('util');
var Base = require('../base-generator');

/*
 * Export `UserGenerator`.
 */

module.exports = UserGenerator;

/**
 * Creates a new instance of UserGenerator with the provided `options`.
 */

function UserGenerator(args, options, config) {
  if (!(this instanceof UserGenerator)) {
    return new UserGenerator(args, options, config);
  }

  Base.call(this, args, options, config);
}

/*
 * Inherit from the base generator.
 */

util.inherits(UserGenerator, Base);
