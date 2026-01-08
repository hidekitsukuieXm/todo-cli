import * as fs from 'fs';
import * as path from 'path';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface TodoStore {
  todos: Todo[];
  nextId: number;
}

const DATA_FILE = path.join(process.cwd(), 'todos.json');

export function loadTodos(): TodoStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    // If file is corrupted, start fresh
  }
  return { todos: [], nextId: 1 };
}

export function saveTodos(store: TodoStore): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

export function addTodo(text: string): Todo {
  const store = loadTodos();
  const todo: Todo = {
    id: store.nextId,
    text,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  store.todos.push(todo);
  store.nextId++;
  saveTodos(store);
  return todo;
}

export function listTodos(showAll: boolean = true): Todo[] {
  const store = loadTodos();
  if (showAll) {
    return store.todos;
  }
  return store.todos.filter((todo) => !todo.completed);
}

export function completeTodo(id: number): Todo | null {
  const store = loadTodos();
  const todo = store.todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = true;
    saveTodos(store);
    return todo;
  }
  return null;
}

export function uncompleteTodo(id: number): Todo | null {
  const store = loadTodos();
  const todo = store.todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = false;
    saveTodos(store);
    return todo;
  }
  return null;
}

export function deleteTodo(id: number): Todo | null {
  const store = loadTodos();
  const index = store.todos.findIndex((t) => t.id === id);
  if (index !== -1) {
    const [deleted] = store.todos.splice(index, 1);
    saveTodos(store);
    return deleted;
  }
  return null;
}

export function clearCompleted(): number {
  const store = loadTodos();
  const originalLength = store.todos.length;
  store.todos = store.todos.filter((todo) => !todo.completed);
  const deletedCount = originalLength - store.todos.length;
  saveTodos(store);
  return deletedCount;
}

export function formatTodo(todo: Todo): string {
  const status = todo.completed ? '[x]' : '[ ]';
  return `${status} ${todo.id}: ${todo.text}`;
}
