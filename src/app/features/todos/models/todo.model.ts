import { TodoPriority } from './todo-priority.enum';
import { TodoStatus } from './todo-status.enum';

export interface Todo {

    id: string;

    title: string;

    description: string;

    priority: TodoPriority;

    status: TodoStatus;

    category: string;

    dueDate: Date | null;

    createdAt: Date;

    updatedAt: Date;

}