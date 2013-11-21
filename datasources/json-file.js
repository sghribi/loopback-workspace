var fs = require('fs');
var path = require('path');
var assert = require('assert');
var async = require('async');
var jf = require('jsonfile');
var Connector = require('loopback-datasource-juggler').Connector;
var inherits = require('util').inherits;

exports.initialize = function(dataSource, done) {
    var settings = dataSource.settings || {};
    var connector = new JSONConnector(settings);
    dataSource.connector = connector;
    connector.dataSource = dataSource;

    done();
}

function JSONConnector(settings) {
  this.settings = settings;
  this._models = {};
}

inherits(JSONConnector, Connector);

/**
 * Create a new model instance
 */
JSONConnector.prototype.create = function (model, data, callback) {
  async.waterfall([
    this.file.bind(this, model),
    function (file, cb) {
      file.data[this.getIdValue(model, data)] = data;
      file.write(cb);
    }.bind(this)
  ], callback);
};

/**
 * Save a model instance
 */
JSONConnector.prototype.save = function (model, data, callback) {
  this.create(model, data, callback);
};
 
/**
 * Check if a model instance exists by id
 */
JSONConnector.prototype.exists = function (model, id, callback) {
  async.waterfall([
    this.find.bind(this, model, id),
    function (model, cb) {
      cb(null, !!model);
    }
  ], callback);
};
 
/**
 * Find a model instance by id
 */
JSONConnector.prototype.find = function find(model, id, callback) {
  async.waterfall([
    this.file.bind(this, model),
    function (file, cb) {
      cb(null, file.data[this.getIdValue(model, data)]);
    }.bind(this)
  ], callback);
};
 
/**
 * Update a model instance or create a new model instance if it doesn't exist
 */
JSONConnector.prototype.updateOrCreate = function updateOrCreate(model, data, callback) {
  var self = this;
  this.exists(model, self.getIdValue(model, data), function (err, exists) {
    if (exists) {
      self.save(model, data, callback);
    } else {
      self.create(model, data, function (err, id) {
        self.setIdValue(model, data, id);
        callback(err, data);
      });
    }
  });
};
 
/**
 * Delete a model instance by id
 */
JSONConnector.prototype.destroy = function destroy(model, id, callback) {
  async.waterfall([
    this.file.bind(this, model),
    function (file, cb) {
      file.data[this.getIdValue(model, data)] = undefined;
      file.write(cb);
    }.bind(this)
  ], callback);
};
 
/**
 * Query model instances by the filter
 */
JSONConnector.prototype.all = function all(model, filter, callback) {
  async.waterfall([
    this.file.bind(this, model),
    function (file, cb) {
      cb(null, file.toArray());
    }.bind(this)
  ], callback);
};
 
/**
 * Delete all model instances
 */
JSONConnector.prototype.destroyAll = function destroyAll(model, callback) {
  async.waterfall([
    this.file.bind(this, model),
    function (file, cb) {
      file.unlink(cb);
    }
  ], callback);
};
 
/**
 * Count the model instances by the where criteria
 */
JSONConnector.prototype.count = function count(model, callback, where) {
  async.waterfall([
    this.all.bind(this, model, {}),
    function (all, cb) {
      cb(null, all.length);
    }
  ], callback);
};
 
/**
 * Update the attributes for a model instance by id
 */
JSONConnector.prototype.updateAttributes = function updateAttrs(model, id, data, callback) {
  if(!id) {
    var err = new Error('You must provide an id when updating attributes!');
    if(callback) {
      return callback(err);
    } else {
      throw err;
    }
  }

  async.waterfall([
    this.find.bind(this, model, id),
    function (inst, cb) {
      if(inst) {
        this.save(model, merge(inst, data), cb);
      } else {
        cb(new Error(model + ' with id ' + id + ' does not exist'));
      }
    }.bind(this)
  ], callback);
};

/**
 * Get a JSONFile object for the given model
 */
JSONConnector.prototype.file = function (model, callback) {
  var filePath = this.dataSource.models[model].settings.file;
  assert(filePath, model + ' does not specify a settings.file');
  var file = new JSONFile(path.join(this.dataSource.settings.root, filePath));
  file.read(callback);
}

function JSONFile(file, data) {
  this.file = file;
  this.data = data || {};
}

JSONFile.prototype.read = function (callback) {
  jf.readFile(this.file, function (err, data) {
    if(err && err.code === 'ENOENT') {
      this.data = {};
      return callback(null, this);
    }

    this.data = data;
    callback(err, this);
  }.bind(this));
}

JSONFile.prototype.write = function (callback) {
  jf.writeFile(this.file, this.data, callback);
}

JSONFile.prototype.unlink = function (callback) {
  fs.unlink(this.file, function (err) {
    if(err) {
      callback(err.code === 'ENOENT' ? null : err);
    } else {
      callback();
    }
  });
}

JSONFile.prototype.toArray = function() {
  var data = this.data;
  var result = [];
  for(var key in data) {
    if(data.hasOwnProperty(key)) {
      result.push(data[key]);
    }
  }
}

function merge(base, update) {
    if (!base) return update;
    Object.keys(update).forEach(function (key) {
        base[key] = update[key];
    });
    return base;
}
