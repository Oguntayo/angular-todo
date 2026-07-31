import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TodoStore } from '../../../todos/store/todo.store';
import { TodoService } from '../../../todos/services/todo.service';
import { Badge } from '../../../../shared/ui/badge/badge';
import { Spinner } from '../../../../shared/ui/spinner/spinner';
import { TodoStatus } from '../../../todos/models/todo-status.enum';
import { TodoPriority } from '../../../todos/models/todo-priority.enum';
import { Todo } from '../../../todos/models/todo.model';

@Component({
  selector: 'app-dashboard-page',
  imports: [Badge, Spinner, RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  readonly store   = inject(TodoStore);
  readonly service = inject(TodoService);

  ngOnInit() {
    if (this.store.todos().length === 0) {
      this.store.loading.set(true);
      this.service.getTodos().subscribe({
        next: (todos) => {
          this.store.setTodos(todos);
          this.store.loading.set(false);
        },
        error: () => {
          this.store.error.set('Failed to load tasks. Is the API server running?');
          this.store.loading.set(false);
        }
      });
    }
  }

  get stats()    { return this.store.stats(); }
  get loading()  { return this.store.loading(); }
  get error()    { return this.store.error(); }

  get recentTodos(): Todo[] {
    return [...this.store.todos()]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }

  get highPriorityTodos(): Todo[] {
    return this.store.todos()
      .filter(t => t.priority === TodoPriority.HIGH && t.status !== TodoStatus.COMPLETED && t.status !== TodoStatus.ARCHIVED)
      .slice(0, 4);
  }

  priorityBarWidth(count: number): string {
    const total = this.stats.total || 1;
    return `${Math.round((count / total) * 100)}%`;
  }

  getStatusLabel(status: TodoStatus): string {
    const map: Record<TodoStatus, string> = {
      [TodoStatus.TODO]: 'To Do',
      [TodoStatus.IN_PROGRESS]: 'In Progress',
      [TodoStatus.COMPLETED]: 'Completed',
      [TodoStatus.ARCHIVED]: 'Archived',
    };
    return map[status] ?? status;
  }

  formatDate(d: Date | string | null): string {
    if (!d) return '—';
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));
  }

  isOverdue(t: Todo): boolean {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date() && t.status !== TodoStatus.COMPLETED && t.status !== TodoStatus.ARCHIVED;
  }
}
