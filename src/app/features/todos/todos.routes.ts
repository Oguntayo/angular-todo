import { Routes } from '@angular/router';

export const todosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/todos-page/todos-page')
        .then(c => c.TodosPage)
  }
];
