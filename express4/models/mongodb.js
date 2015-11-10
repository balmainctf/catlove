/**
 * models mongodb.js
 * Created by soraping on 15/11/10.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/movie');
exports.mongodb = mongoose;
