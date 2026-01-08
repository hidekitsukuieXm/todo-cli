#!/usr/bin/env node
import { Command } from 'commander';
import {
  addTodo,
  listTodos,
  completeTodo,
  uncompleteTodo,
  deleteTodo,
  clearCompleted,
  formatTodo,
} from './commands/todo';

const program = new Command();

program
  .name('todo')
  .description('A simple TODO CLI application')
  .version('1.0.0');

program
  .command('add <text>')
  .description('Add a new todo')
  .action((text: string) => {
    const todo = addTodo(text);
    console.log(`Added: ${formatTodo(todo)}`);
  });

program
  .command('list')
  .alias('ls')
  .description('List all todos')
  .option('-a, --all', 'Show all todos including completed', true)
  .option('-p, --pending', 'Show only pending todos')
  .action((options) => {
    const showAll = !options.pending;
    const todos = listTodos(showAll);
    if (todos.length === 0) {
      console.log('No todos found.');
      return;
    }
    console.log('\nTODO List:');
    console.log('----------');
    todos.forEach((todo) => {
      console.log(formatTodo(todo));
    });
    console.log('');
  });

program
  .command('done <id>')
  .alias('complete')
  .description('Mark a todo as completed')
  .action((id: string) => {
    const todo = completeTodo(parseInt(id, 10));
    if (todo) {
      console.log(`Completed: ${formatTodo(todo)}`);
    } else {
      console.error(`Todo with id ${id} not found.`);
      process.exit(1);
    }
  });

program
  .command('undone <id>')
  .alias('uncomplete')
  .description('Mark a todo as not completed')
  .action((id: string) => {
    const todo = uncompleteTodo(parseInt(id, 10));
    if (todo) {
      console.log(`Uncompleted: ${formatTodo(todo)}`);
    } else {
      console.error(`Todo with id ${id} not found.`);
      process.exit(1);
    }
  });

program
  .command('delete <id>')
  .alias('rm')
  .description('Delete a todo')
  .action((id: string) => {
    const todo = deleteTodo(parseInt(id, 10));
    if (todo) {
      console.log(`Deleted: ${formatTodo(todo)}`);
    } else {
      console.error(`Todo with id ${id} not found.`);
      process.exit(1);
    }
  });

program
  .command('clear')
  .description('Remove all completed todos')
  .action(() => {
    const count = clearCompleted();
    console.log(`Cleared ${count} completed todo(s).`);
  });

program.parse();
