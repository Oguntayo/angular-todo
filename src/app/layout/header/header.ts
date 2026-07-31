import { Component, EventEmitter, inject, Output } from '@angular/core';
import { TodoStore } from '../../features/todos/store/todo.store';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly store = inject(TodoStore);
  @Output() toggleSidebar = new EventEmitter<void>();

  get overdueCount() { return this.store.stats().overdue; }
}
