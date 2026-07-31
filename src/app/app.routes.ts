import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes')
            .then(r => r.dashboardRoutes)
      },
      {
        path: 'todos',
        loadChildren: () =>
          import('./features/todos/todos.routes')
            .then(r => r.todosRoutes)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];