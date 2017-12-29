/*globals require, module */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resultSchema = new Schema({
  response1: String,
  response2: String
});

var assignmentSchema = new Schema({
  taskID: String,
  assignmentID: String,
  workerID: String,
  assignmentResult: String
});

module.exports = mongoose.model('Assignment', assignmentSchema);
