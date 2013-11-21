var fs = require('fs');
var path = require('path');
var assert = require('assert');
var async = require('async');
var jf = require('jsonfile');
var Connector = require('loopback-datasource-juggler').Connector;
var inherits = require('util').inherits;

exports.initialize = function(dataSource, done) {
    var settings = dataSource.settings || {};
    var connector = new ProjectConnector(settings);
    dataSource.connector = connector;
    connector.dataSource = dataSource;

    done();
}

function ProjectConnector(settings) {
  this.settings = settings;
  this._models = {};
}

inherits(ProjectConnector, Connector);

/**
 * Create a new model instance
 */
ProjectConnector.prototype.create = function (model, data, callback) {
  createFromTemplate(data.dir, data.template, callback);
};

/**
 * Save a model instance
 */
ProjectConnector.prototype.save = function (model, data, callback) {
  async.waterfall([
    this.project.bind(this, data.dir),
    function (project) {
      
    }
  ])
};
 
/**
 * Check if a model instance exists by id
 */
ProjectConnector.prototype.exists = function (model, id, callback) {

};
 
/**
 * Find a model instance by id
 */
ProjectConnector.prototype.find = function find(model, id, callback) {

};
 
/**
 * Update a model instance or create a new model instance if it doesn't exist
 */
ProjectConnector.prototype.updateOrCreate = function updateOrCreate(model, data, callback) {

};
 
/**
 * Delete a model instance by id
 */
ProjectConnector.prototype.destroy = function destroy(model, id, callback) {

};
 
/**
 * Query model instances by the filter
 */
ProjectConnector.prototype.all = function all(model, filter, callback) {

};
 
/**
 * Delete all model instances
 */
ProjectConnector.prototype.destroyAll = function destroyAll(model, callback) {

};
 
/**
 * Count the model instances by the where criteria
 */
ProjectConnector.prototype.count = function count(model, callback, where) {

};
 
/**
 * Update the attributes for a model instance by id
 */
ProjectConnector.prototype.updateAttributes = function updateAttrs(model, id, data, callback) {

};
