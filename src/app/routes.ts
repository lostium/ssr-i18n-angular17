import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: 'page-1',
    loadComponent: () =>
      import('./pages/page-1/page-1.component').then((c) => c.Page1Component),
  },
  {
    path: 'page-2',
    loadComponent: () =>
      import('./pages/page-2/page-2.component').then((c) => c.Page2Component),
  },
  {
    path: 'page-3',
    loadComponent: () =>
      import('./pages/page-3/page-3.component').then((c) => c.Page3Component),
  },
  {
    path: 'page-4',
    loadComponent: () =>
      import('./pages/page-4/page-4.component').then((c) => c.Page4Component),
  },
];
