import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <a routerLink="/dashboard" class="brand-link">
            📚 Biblioteca Digital
          </a>
        </div>
        
        <div class="nav-menu">
          <div class="nav-user">
            <span class="user-greeting">
              Hola, {{ authService.currentUser()?.name }}
            </span>
            <span class="user-role" [class.admin]="authService.isAdmin()">
              {{ authService.currentUser()?.role === 'admin' ? 'Administrador' : 'Usuario' }}
            </span>
          </div>
          
          <button class="logout-btn" (click)="logout()">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: white;
      border-bottom: 1px solid #e5e7eb;
      padding: 0 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
    }

    .brand-link {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2563eb;
      text-decoration: none;
      transition: color 0.2s;
    }

    .brand-link:hover {
      color: #1d4ed8;
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .nav-user {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .user-greeting {
      font-weight: 500;
      color: #374151;
    }

    .user-role {
      font-size: 0.875rem;
      color: #6b7280;
      background: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
    }

    .user-role.admin {
      background: #fef3c7;
      color: #92400e;
    }

    .logout-btn {
      background: #ef4444;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .logout-btn:hover {
      background: #dc2626;
    }

    @media (max-width: 640px) {
      .nav-container {
        padding: 0 0.5rem;
      }
      
      .nav-user {
        display: none;
      }
      
      .brand-link {
        font-size: 1.25rem;
      }
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}