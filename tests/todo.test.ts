import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  addTodo,
  listTodos,
  completeTodo,
  uncompleteTodo,
  deleteTodo,
  clearCompleted,
  formatTodo,
  loadTodos,
  Todo,
} from '../src/commands/todo';

const DATA_FILE = path.join(process.cwd(), 'todos.json');

describe('Todo Commands', () => {
  beforeEach(() => {
    // Clean up before each test
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE);
    }
  });

  afterEach(() => {
    // Clean up after each test
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE);
    }
  });

  describe('addTodo', () => {
    it('should add a new todo', () => {
      const todo = addTodo('Test todo');
      expect(todo.id).toBe(1);
      expect(todo.text).toBe('Test todo');
      expect(todo.completed).toBe(false);
    });

    it('should increment id for each new todo', () => {
      const todo1 = addTodo('First todo');
      const todo2 = addTodo('Second todo');
      expect(todo1.id).toBe(1);
      expect(todo2.id).toBe(2);
    });
  });

  describe('listTodos', () => {
    it('should return empty array when no todos', () => {
      const todos = listTodos();
      expect(todos).toEqual([]);
    });

    it('should return all todos', () => {
      addTodo('Todo 1');
      addTodo('Todo 2');
      const todos = listTodos();
      expect(todos).toHaveLength(2);
    });

    it('should filter completed todos when showAll is false', () => {
      const todo1 = addTodo('Todo 1');
      addTodo('Todo 2');
      completeTodo(todo1.id);
      const todos = listTodos(false);
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toBe('Todo 2');
    });
  });

  describe('completeTodo', () => {
    it('should mark todo as completed', () => {
      const todo = addTodo('Test todo');
      const completed = completeTodo(todo.id);
      expect(completed?.completed).toBe(true);
    });

    it('should return null for non-existent todo', () => {
      const result = completeTodo(999);
      expect(result).toBeNull();
    });
  });

  describe('uncompleteTodo', () => {
    it('should mark todo as not completed', () => {
      const todo = addTodo('Test todo');
      completeTodo(todo.id);
      const uncompleted = uncompleteTodo(todo.id);
      expect(uncompleted?.completed).toBe(false);
    });

    it('should return null for non-existent todo', () => {
      const result = uncompleteTodo(999);
      expect(result).toBeNull();
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', () => {
      const todo = addTodo('Test todo');
      const deleted = deleteTodo(todo.id);
      expect(deleted?.id).toBe(todo.id);
      expect(listTodos()).toHaveLength(0);
    });

    it('should return null for non-existent todo', () => {
      const result = deleteTodo(999);
      expect(result).toBeNull();
    });
  });

  describe('clearCompleted', () => {
    it('should remove all completed todos', () => {
      const todo1 = addTodo('Todo 1');
      addTodo('Todo 2');
      const todo3 = addTodo('Todo 3');
      completeTodo(todo1.id);
      completeTodo(todo3.id);
      const count = clearCompleted();
      expect(count).toBe(2);
      expect(listTodos()).toHaveLength(1);
    });

    it('should return 0 when no completed todos', () => {
      addTodo('Todo 1');
      const count = clearCompleted();
      expect(count).toBe(0);
    });
  });

  describe('formatTodo', () => {
    it('should format incomplete todo correctly', () => {
      const todo: Todo = {
        id: 1,
        text: 'Test',
        completed: false,
        createdAt: new Date().toISOString(),
      };
      expect(formatTodo(todo)).toBe('[ ] 1: Test');
    });

    it('should format completed todo correctly', () => {
      const todo: Todo = {
        id: 1,
        text: 'Test',
        completed: true,
        createdAt: new Date().toISOString(),
      };
      expect(formatTodo(todo)).toBe('[x] 1: Test');
    });
  });

  describe('loadTodos', () => {
    it('should return empty store when file does not exist', () => {
      const store = loadTodos();
      expect(store.todos).toEqual([]);
      expect(store.nextId).toBe(1);
    });
  });
});
