import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo } from '../../models/todo.model';
import { TodoPriority } from '../../models/todo-priority.enum';
import { TodoStatus } from '../../models/todo-status.enum';
import { TodoService } from '../../services/todo.service';
import { Spinner } from '../../../../shared/ui/spinner/spinner';

@Component({
  selector: 'app-todo-form',
  imports: [ReactiveFormsModule, Spinner],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.scss'
})
export class TodoForm implements OnInit {
  @Input() todo: Todo | null = null;
  @Output() save = new EventEmitter<Todo>();
  @Output() cancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(TodoService);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly TodoPriority = TodoPriority;
  readonly TodoStatus = TodoStatus;

  form!: FormGroup;

  ngOnInit() {
    let formattedDueDate = '';
    if (this.todo?.dueDate) {
      formattedDueDate = new Date(this.todo.dueDate).toISOString().split('T')[0];
    }

    this.form = this.fb.group({
      title: [this.todo?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [this.todo?.description || ''],
      priority: [this.todo?.priority || TodoPriority.MEDIUM, Validators.required],
      status: [this.todo?.status || TodoStatus.TODO, Validators.required],
      category: [this.todo?.category || 'General', Validators.required],
      dueDate: [formattedDueDate]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const val = this.form.value;
    const dueDate = val.dueDate ? new Date(val.dueDate).toISOString() : null;

    if (this.todo) {
      this.service.updateTodo(this.todo.id, {
        ...val,
        dueDate
      }).subscribe({
        next: (updated) => {
          this.loading.set(false);
          this.save.emit(updated);
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('Failed to update task. Please try again.');
        }
      });
    } else {
      this.service.createTodo({
        ...val,
        dueDate
      }).subscribe({
        next: (created) => {
          this.loading.set(false);
          this.save.emit(created);
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('Failed to create task. Please try again.');
        }
      });
    }
  }
}
