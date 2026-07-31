import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoStore } from '../../store/todo.store';
import { TodoService } from '../../services/todo.service';
import { TodoPriority } from '../../models/todo-priority.enum';
import { TodoStatus } from '../../models/todo-status.enum';
import { TodoCard } from '../../components/todo-card/todo-card';
import { TodoForm } from '../../components/todo-form/todo-form';
import { Spinner } from '../../../../shared/ui/spinner/spinner';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todos-page',
  imports: [FormsModule, TodoCard, TodoForm, Spinner],
  templateUrl: './todos-page.html',
  styleUrl: './todos-page.scss',
})
export class TodosPage implements OnInit {
  readonly store   = inject(TodoStore);
  readonly service = inject(TodoService);

  readonly showForm    = signal(false);
  readonly editingTodo = signal<Todo | null>(null);

  readonly TodoStatus   = TodoStatus;
  readonly TodoPriority = TodoPriority;

  readonly pageSizeOptions = [6, 12, 24];

  readonly statusOptions = [
    { label: 'All',         value: 'ALL'                   },
    { label: 'To Do',       value: TodoStatus.TODO          },
    { label: 'In Progress', value: TodoStatus.IN_PROGRESS   },
    { label: 'Completed',   value: TodoStatus.COMPLETED     },
    { label: 'Archived',    value: TodoStatus.ARCHIVED      },
  ];

  readonly priorityOptions = [
    { label: 'All Priorities', value: 'ALL'              },
    { label: 'High',           value: TodoPriority.HIGH  },
    { label: 'Medium',         value: TodoPriority.MEDIUM },
    { label: 'Low',            value: TodoPriority.LOW   },
  ];

  readonly sortOptions = [
    { label: 'Newest First',  field: 'createdAt' as const, dir: 'desc' as const },
    { label: 'Oldest First',  field: 'createdAt' as const, dir: 'asc'  as const },
    { label: 'Priority',      field: 'priority'  as const, dir: 'asc'  as const },
    { label: 'Due Date',      field: 'dueDate'   as const, dir: 'asc'  as const },
    { label: 'Title A–Z',     field: 'title'     as const, dir: 'asc'  as const },
  ];

  ngOnInit() {
    if (this.store.todos().length === 0) {
      this.loadTodos();
    }
  }

  loadTodos() {
    this.store.loading.set(true);
    this.service.getTodos().subscribe({
      next:  t => { this.store.setTodos(t); this.store.loading.set(false); },
      error: () => { this.store.error.set('Could not load tasks.'); this.store.loading.set(false); }
    });
  }

  get todos()          { return this.store.paginatedTodos(); }
  get totalTodos()     { return this.store.filteredTodos().length; }
  get loading()        { return this.store.loading(); }
  get error()          { return this.store.error(); }
  get search()         { return this.store.searchQuery(); }
  get status()         { return this.store.statusFilter(); }
  get priority()       { return this.store.priorityFilter(); }
  get currentPage()    { return this.store.currentPage(); }
  get totalPages()     { return this.store.totalPages(); }
  get pageSize()       { return this.store.pageSize(); }
  get paginationStats(){ return this.store.paginationStats(); }

  get pages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pagesList: number[] = [];

    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pagesList.push(i);
    }
    return pagesList;
  }

  setSearch(v: string)   { this.store.setSearchQuery(v); }
  setStatus(v: string)   { this.store.setStatusFilter(v as any); }
  setPriority(v: string) { this.store.setPriorityFilter(v as any); }

  setSort(opt: typeof this.sortOptions[0]) {
    this.store.setSort(opt.field, opt.dir);
  }

  setPage(p: number) {
    this.store.setPage(p);
  }

  onPageSizeChange(size: string | number) {
    this.store.setPageSize(Number(size));
  }

  openCreate() { this.editingTodo.set(null); this.showForm.set(true); }
  openEdit(t: Todo) { this.editingTodo.set(t); this.showForm.set(true); }
  closeForm() { this.showForm.set(false); this.editingTodo.set(null); }

  onSaved(todo: Todo) {
    if (this.editingTodo()) {
      this.store.updateTodo(todo);
    } else {
      this.store.addTodo(todo);
    }
    this.closeForm();
  }

  onDelete(id: string) {
    this.service.deleteTodo(id).subscribe(() => this.store.removeTodo(id));
  }

  onStatusChange(todo: Todo, status: TodoStatus) {
    this.service.updateTodo(todo.id, { status }).subscribe(updated => this.store.updateTodo(updated));
  }

  clearFilters() {
    this.store.setSearchQuery('');
    this.store.setStatusFilter('ALL');
    this.store.setPriorityFilter('ALL');
  }

  get isFiltered() {
    return this.store.searchQuery() || this.store.statusFilter() !== 'ALL' || this.store.priorityFilter() !== 'ALL';
  }
}
