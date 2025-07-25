import { Routes } from '@angular/router';
import { AuthGuard, GuestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent),
    canActivate: [GuestGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
    canActivate: [GuestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent),
    canActivate: [GuestGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'books',
        pathMatch: 'full'
      },
      {
        path: 'books',
        loadComponent: () => import('./features/books/books-list.component').then(m => m.BooksListComponent)
      },
      {
        path: 'books/create',
        loadComponent: () => import('./features/books/book-form.component').then(m => m.BookFormComponent),
        data: { role: 'admin' }
      },
      {
        path: 'books/edit/:id',
        loadComponent: () => import('./features/books/book-form.component').then(m => m.BookFormComponent),
        data: { role: 'admin' }
      },
      {
        path: 'authors',
        loadComponent: () => import('./features/authors/authors-list.component').then(m => m.AuthorsListComponent),
        data: { role: 'admin' }
      },
      {
        path: 'authors/create',
        loadComponent: () => import('./features/authors/author-form.component').then(m => m.AuthorFormComponent),
        data: { role: 'admin' }
      },
      {
        path: 'authors/edit/:id',
        loadComponent: () => import('./features/authors/author-form.component').then(m => m.AuthorFormComponent),
        data: { role: 'admin' }
      },
      {
        path: 'loans',
        loadComponent: () => import('./features/loans/loans-list.component').then(m => m.LoansListComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];