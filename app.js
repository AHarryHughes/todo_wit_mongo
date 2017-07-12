const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bodyParser = require('body-parser');
const Todo = require('./models/todo-mvc');
const app = express();

mongoose.connect('mongodb://localhost:27017/todo-mvc');
mongoose.connection
    .once('open', () => console.log('good to go'))
    .on('error', (error) => {
      console.warn('Warning', error);
    });


app.use('/static', express.static('static'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var todos_type = {id: 0, title: '', order: 0, completed: false};

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/static/index.html");
})

// put routes here
//GET /api/todos/ - return a JSON array of todo items
app.get('/api/todos/', async function (req, res) {
    console.log("getting it");
    let todo_list = await Todo.find();
    console.log(todo_list);
    return res.json(todo_list);
});

//POST /api/todos/ - post a JSON representation of a todo and have it saved. Returns the saved todo item in JSON.
app.post('/api/todos/', async function (req, res) {
    console.log('req.body', req.body)
    console.log('posting it:'+req.body.title);
    let title = req.body.title;
    
    todos_type.id++;
    todos_type.order++;
    todos_type.title= title;
    todos_type.completed= false;

    let nuTodo = new Todo(todos_type);
     nuTodo.save()
      .then( async () => {
        console.log("getting it");
        let todo_list = await Todo.find();
        console.log(todo_list);
        return res.json(todo_list);
      });

    
});

//GET /api/todos[/id] - get a specific todo item.
app.get('/api/todos/:id', async function (req, res) {
    console.log("getting one"+req.params.id);
    let id = parseInt(req.params.id);
    let todo_item = await Todo.find({id: id});
    console.log(todo_item);
    return res.json(todo_item);
});

//PUT /api/todos[/id] - update a todo item. Returns the modified todo item.
app.put('/api/todos/:id', async function (req, res) {
   
    let id = parseInt(req.params.id);

    console.log("modding one "+req.params.id+" to "+req.body.title);
    let title = req.body.title;

    let to_update = await Todo.find({ id: id });

    let current_title = to_update[0].title;

    await Todo.update({ title: current_title }, { title: title });

    let updated = await Todo.find({ title: title });

    return res.json(updated);
});

//PATCH /api/todos[/id] - partially update a todo item. Returns the modified todo item.
app.patch('/api/todos/:id', async (req, res) => {
    
    let id = parseInt(req.params.id);

    console.log("modding one "+req.params.id+" to "+req.body.title);
    let title = req.body.title;

    let to_update = await Todo.find({ id: id });

    let current_title = to_update[0].title;

    await Todo.update({ title: current_title }, { title: title });

    let updated = await Todo.find({ title: title });

    return res.json(updated);
});

//DELETE /api/todos[/id]
app.delete('/api/todos/:id', async (req, res) => {
    console.log("deleteing one"+req.params.id);
    console.log(typeof req.params.id);
    let id = req.params.id;

    await Todo.findOneAndRemove({ id: id });
    console.log(await Todo.find({ id: id }));

    console.log("getting it");
    let todo_list = await Todo.find();
    console.log(todo_list);
    return res.json(todo_list);
});

app.listen(4000, function () {
    console.log('Express running on http://localhost:4000/.')
});