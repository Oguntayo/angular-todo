import { computed, Injectable, signal } from '@angular/core';

import { Todo } from '../models/todo.model';
import { TodoStatus } from '../models/todo-status.enum';
import { TodoPriority } from '../models/todo-priority.enum';

export type SortField = 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortDir   = 'asc' | 'desc';

@Injectable({ providedIn: 'root' })
export class TodoStore {

  // ---- Raw state -------------------------------------------------
  readonly todos    = signal<Todo[]>([]);
  readonly loading  = signal(false);
  readonly error    = signal<string | null>(null);

  // ---- Filter / sort / pagination state --------------------------
  readonly searchQuery    = signal('');
  readonly statusFilter   = signal<TodoStatus | 'ALL'>('ALL');
  readonly priorityFilter = signal<TodoPriority | 'ALL'>('ALL');
  readonly sortField      = signal<SortField>('createdAt');
  readonly sortDir        = signal<SortDir>('desc');

  readonly currentPage = signal(1);
  readonly pageSize    = signal(6);

  // ---- Computed: filtered + sorted list --------------------------
  readonly filteredTodos = computed(() => {
    const query    = this.searchQuery().toLowerCase().trim();
    const status   = this.statusFilter();
    const priority = this.priorityFilter();
    const field    = this.sortField();
    const dir      = this.sortDir();

    let list = this.todos().filter(t => {
      const matchSearch   = !query ||
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query);
      const matchStatus   = status   === 'ALL' || t.status   === status;
      const matchPriority = priority === 'ALL' || t.priority === priority;
      return matchSearch && matchStatus && matchPriority;
    });

    const priorityOrder: Record<TodoPriority, number> = {
      [TodoPriority.HIGH]:   0,
      [TodoPriority.MEDIUM]: 1,
      [TodoPriority.LOW]:    2,
    };

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (field === 'priority') {
        cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (field === 'title') {
        cmp = a.title.localeCompare(b.title);
      } else if (field === 'dueDate') {
        const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        cmp = da - db;
      } else {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return dir === 'asc' ? cmp : -cmp;
    });

    return list;
  });

  // ---- Computed: Pagination -------------------------------------
  readonly totalPages = computed(() => {
    const total = this.filteredTodos().length;
    const size = this.pageSize();
    return Math.ceil(total / size) || 1;
  });

  readonly paginatedTodos = computed(() => {
    const all = this.filteredTodos();
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return all.slice(start, start + size);
  });

  readonly paginationStats = computed(() => {
    const total = this.filteredTodos().length;
    const page = this.currentPage();
    const size = this.pageSize();
    if (total === 0) return { start: 0, end: 0, total: 0 };
    const start = (page - 1) * size + 1;
    const end = Math.min(page * size, total);
    return { start, end, total };
  });

  // ---- Computed: stats ------------------------------------------
  readonly stats = computed(() => {
    const all = this.todos();
    const now = new Date();

    const total       = all.length;
    const todo        = all.filter(t => t.status === TodoStatus.TODO).length;
    const inProgress  = all.filter(t => t.status === TodoStatus.IN_PROGRESS).length;
    const completed   = all.filter(t => t.status === TodoStatus.COMPLETED).length;
    const archived    = all.filter(t => t.status === TodoStatus.ARCHIVED).length;
    const overdue     = all.filter(t =>
      t.dueDate && new Date(t.dueDate) < now &&
      t.status !== TodoStatus.COMPLETED &&
      t.status !== TodoStatus.ARCHIVED
    ).length;
    const high        = all.filter(t => t.priority === TodoPriority.HIGH).length;
    const medium      = all.filter(t => t.priority === TodoPriority.MEDIUM).length;
    const low         = all.filter(t => t.priority === TodoPriority.LOW).length;

    return { total, todo, inProgress, completed, archived, overdue, high, medium, low };
  });

  // ---- Mutations ------------------------------------------------
  setTodos(todos: Todo[])   { this.todos.set(todos); }
  addTodo(todo: Todo)       { this.todos.update(list => [todo, ...list]); }
  updateTodo(updated: Todo) { this.todos.update(list => list.map(t => t.id === updated.id ? updated : t)); }
  removeTodo(id: string)    { this.todos.update(list => list.filter(t => t.id !== id)); }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  setStatusFilter(status: TodoStatus | 'ALL') {
    this.statusFilter.set(status);
    this.currentPage.set(1);
  }

  setPriorityFilter(priority: TodoPriority | 'ALL') {
    this.priorityFilter.set(priority);
    this.currentPage.set(1);
  }

  setSort(field: SortField, dir: SortDir) {
    this.sortField.set(field);
    this.sortDir.set(dir);
    this.currentPage.set(1);
  }

  setPage(page: number) {
    const max = this.totalPages();
    const valid = Math.max(1, Math.min(page, max));
    this.currentPage.set(valid);
  }

  setPageSize(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }
}