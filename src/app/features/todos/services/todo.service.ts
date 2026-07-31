import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Todo } from '../models/todo.model';

import { environment } from '../../../../environments/environment';

export type CreateTodoDto = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTodoDto = Partial<Omit<Todo, 'id' | 'createdAt'>>;

@Injectable({ providedIn: 'root' })
export class TodoService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  getTodo(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  createTodo(dto: CreateTodoDto): Observable<Todo> {
    const now = new Date().toISOString();
    const payload = { ...dto, createdAt: now, updatedAt: now };
    return this.http.post<Todo>(this.apiUrl, payload);
  }

  updateTodo(id: string, dto: UpdateTodoDto): Observable<Todo> {
    const payload = { ...dto, updatedAt: new Date().toISOString() };
    return this.http.patch<Todo>(`${this.apiUrl}/${id}`, payload);
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}