import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () =>
      import('./tasks/presentation/pages/tasks/tasks.page').then(
        (m) => m.TasksPage,
      ),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./tasks/presentation/pages/categories/categories.page').then(
        (m) => m.CategoriesPage,
      ),
  },
  { path: 'tabs', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'home', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
];
