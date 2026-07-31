import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TodoStore } from '../../features/todos/store/todo.store';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  host: {
    '[class.sidebar-host--open]': 'isOpen'
  }
})
export class Sidebar {
  readonly store = inject(TodoStore);
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  get inProgressCount() { return this.store.stats().inProgress; }

  onNavClick() {
    this.closeSidebar.emit();
  }
}
