import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoStatus } from '../../models/todo-status.enum';
import { Badge } from '../../../../shared/ui/badge/badge';
import { ConfirmDialog } from '../../../../shared/ui/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-todo-card',
  imports: [Badge, ConfirmDialog],
  templateUrl: './todo-card.html',
  styleUrl: './todo-card.scss'
})
export class TodoCard {
  @Input({ required: true }) todo!: Todo;
  @Output() edit = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<TodoStatus>();

  readonly showConfirm = signal(false);
  readonly TodoStatus = TodoStatus;

  get isOverdue(): boolean {
    if (!this.todo.dueDate) return false;
    return new Date(this.todo.dueDate) < new Date() &&
           this.todo.status !== TodoStatus.COMPLETED &&
           this.todo.status !== TodoStatus.ARCHIVED;
  }

  formatDate(d: Date | string | null): string {
    if (!d) return 'No due date';
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));
  }

  toggleCompleted(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const newStatus = checked ? TodoStatus.COMPLETED : TodoStatus.TODO;
    this.statusChange.emit(newStatus);
  }

  onStatusSelect(event: Event) {
    const val = (event.target as HTMLSelectElement).value as TodoStatus;
    this.statusChange.emit(val);
  }

  promptDelete() { this.showConfirm.set(true); }
  confirmDelete() { this.showConfirm.set(false); this.delete.emit(this.todo.id); }
  cancelDelete() { this.showConfirm.set(false); }
}
