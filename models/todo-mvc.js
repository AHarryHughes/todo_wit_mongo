const mongoose = require('mongoose');

const todoschema = new mongoose.Schema({
  id: Number,
  title: String,
  order: Number,
  completed: Boolean
});

const Todo = mongoose.model('todoitems', todoschema);

module.exports = Todo;