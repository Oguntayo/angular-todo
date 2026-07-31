import { Component, Input } from '@angular/core';
import { TodoPriority } from '../../../features/todos/models/todo-priority.enum';
import { TodoStatus } from '../../../features/todos/models/todo-status.enum';

export type BadgeVariant = 'priority' | 'status' | 'category';

@Component({
  selector: 'app-badge',
  imports: [],
  template: `<span class="badge" [class]="classes">{{ label }}</span>`,
  styleUrl: './badge.scss'
})
export class Badge {
  @Input() variant: BadgeVariant = 'category';
  @Input() value: string = '';

  get label(): string {
    switch (this.value) {
      case TodoStatus.IN_PROGRESS: return 'In Progress';
      case TodoStatus.COMPLETED:   return 'Completed';
      case TodoStatus.ARCHIVED:    return 'Archived';
      case TodoStatus.TODO:        return 'To Do';
      default: return this.value;
    }
  }

  get classes(): string {
    if (this.variant === 'priority') {
      return `badge--priority badge--${this.value.toLowerCase()}`;
    }
    if (this.variant === 'status') {
      return `badge--status badge--${this.value.toLowerCase().replace('_', '-')}`;
    }
    return 'badge--category';
  }
}
