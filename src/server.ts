import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import {
  addTodo,
  listTodos,
  completeTodo,
  uncompleteTodo,
  deleteTodo,
  clearCompleted,
  Todo,
} from './commands/todo';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Favicon handler - returns 204 No Content to avoid 404 errors
app.get('/favicon.ico', (_req: Request, res: Response) => {
  res.status(204).end();
});

// API Routes
app.get('/api/todos', (_req: Request, res: Response) => {
  const todos = listTodos(true);
  res.json(todos);
});

app.post('/api/todos', (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Text is required' });
    return;
  }
  const todo = addTodo(text);
  res.status(201).json(todo);
});

app.patch('/api/todos/:id/complete', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const todo = completeTodo(id);
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

app.patch('/api/todos/:id/uncomplete', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const todo = uncompleteTodo(id);
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

app.delete('/api/todos/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const todo = deleteTodo(id);
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

app.delete('/api/todos/completed/clear', (_req: Request, res: Response) => {
  const count = clearCompleted();
  res.json({ deleted: count });
});

// Serve index.html for root
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;
