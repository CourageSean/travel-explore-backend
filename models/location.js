const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const locationSchema = new Schema({
  country: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  list: {
    type: Array,
    required: true,
  },
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
