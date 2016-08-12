    > This is not faas.
    > This is event not a prototype. Just looking for ideas.
    > Dont meet this repo with serious intentions

# Faas

Development:
```bash
git clone https://github.com/noserver-js/faas
cd faas
npm link faas
```


## Faas server

```bash
faas server -p 3001
```

Workflow:

  - find all modules form current directory: find via glob all *package.json* ingoring *node_modules*
  - require found modules and collect exported functions
  - start server with http and socket handlers

Communication between client and server available in two ways:

  - Sockets
  - http requests

## Sockets

Faas web clinet - https://github.com/noserver-js/faas-client

```js
import faas from 'faas-client';

fass({
  host: 'localhost',
  appId: 'your_application_id' // right now this is not required
}).then(({faas}) => {

}):
```

There is `faas` object after promise resolved. It contains all available server methods.

```js
faas.addTodo({

});

faas.getTodos({

});
```

`addTodo` and `getTodo` are implemented on server.


## Http

Url prefix for http functions - **/f/**.

Each package - is separated / standalone module with its own npm dependencies.
Http request template *${packageName}/${packageVersion}/${exportedFunction}*.

For example for url */f/todo/1.0.0/getTodos* module */todo/index.js* will be required (module entry point could be configured via package.json "main" attribute) and it should exports `getTodos` function.


## Http routes

Could be configured at package.json. Example

```js
{
  "name": "todos",
  "version": "1.0.0",
  "routes": {
    "GET": ["getTodos"],
    "POST": ["addTodo"]
  }
}
```

In this example method *getTodos* available only for GET requests and *addTodo* only for POST.

  - `POST /f/todo/1.0.0/addTodo` correct
  - `GET /f/todo/1.0.0/getTodos` correct
  - `POST /f/todo/1.0.0/getTodos` 404

## Http routes

Could be configured in package.json at the dir where faas server was started.

```js
"route-aliases": {
  "/add-todo": ["POST", "todos", "1.0.0", "addTodo"],
  "/get-todos": ["GET", "todos", "1.0.0", "getTodos"]
}
```
