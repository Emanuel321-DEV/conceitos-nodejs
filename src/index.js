const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const findUser = users.find(user => user.username === username);

  if(!findUser){
    return response.status(404).json({ error: 'User not found' });
  }

  request.user = findUser;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const usernameAlreadyExists = users.some(user => user.username === username);

  if(usernameAlreadyExists){
    return response.status(400).json({ error: 'Username already exists.'})
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).json(user);



});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  const todos = user.todos;

  return response.json(todos);


});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;
  
  const todo = {
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(todo);


  return response.status(201).json(todo);


});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  
  const { id }  = request.params;
  const { user } = request;
  const { title, deadline } = request.body;


  const findTodoIndex = user.todos.findIndex(todo => todo.id === id);
  
  if(findTodoIndex === -1){
    return response.status(404).json({ error: 'Todo not found' });
  }

  user.todos[findTodoIndex].title = title;
  user.todos[findTodoIndex].deadline = deadline;

  return response.json(user.todos[findTodoIndex]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;
  
  const findTodo = user.todos.find(todo => todo.id === id);
  
  if(!findTodo){
    return response.status(404).json({ error: 'Todo not found' });
  }

  findTodo.done = true;

  return response.json(findTodo);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const findTodoIndex = user.todos.findIndex(user => user.id === id);

  if(findTodoIndex === -1){
    return response.status(404).json({ error: 'Todo not found' });
  }

  const excludeTodo = user.todos.filter(todo => todo.id !== id);
  user.todos = excludeTodo;

  return response.status(204).send();

});

module.exports = app;