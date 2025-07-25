import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { NavbarComponent } from '../../shared/components/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <div class="dashboard-layout">
      <app-navbar></app-navbar>
      
      <div class="dashboard-container">
        <aside class="sidebar">
          <nav class="sidebar-nav">
            <div class="nav-section">
              <h3 class="nav-title">Principal</h3>
              <a routerLink="/dashboard/books" routerLinkActive="active" class="nav-link">
                📚 Libros
              </a>
              @if (authService.isAdmin()) {
                <a routerLink="/dashboard/authors" routerLinkActive="active" class="nav-link">
                  ✍️ Autores
                </a>
              }
              <a routerLink="/dashboard/loans" routerLinkActive="active" class="nav-link">
                📋 Mis Préstamos
              </a>
            </div>
            
            <div class="nav-section">
              <h3 class="nav-title">Cuenta</h3>
              <a routerLink="/dashboard/profile" routerLinkActive="active" class="nav-link">
                👤 Mi Perfil
              </a>
            </div>
          </nav>
        </aside>

        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      min-height: 100vh;
      background: #f9fafb;
    }

    .dashboard-container {
      display: flex;
      max-width: 1200px;
      margin: 0 auto;
      min-height: calc(100vh - 64px);
    }

    .sidebar {
      width: 250px;
      background: white;
      border-right: 1px solid #e5e7eb;
      padding: 2rem 1rem;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .nav-section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      color: #374151;
      text-decoration: none;
      border-radius: 0.5rem;
      font-weight: 500;
      transition: all 0.2s;
    }

    .nav-link:hover {
      background: #f3f4f6;
      color: #2563eb;
    }

    .nav-link.active {
      background: #eff6ff;
      color: #2563eb;
      border: 1px solid #dbeafe;
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      background: #f9fafb;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        flex-direction: column;
      }
      
      .sidebar {
        width: 100%;
        padding: 1rem;
      }
      
      .sidebar-nav {
        flex-direction: row;
        overflow-x: auto;
        gap: 1rem;
      }
      
      .nav-section {
        flex-shrink: 0;
      }
      
      .main-content {
        padding: 1rem;
      }
    }
  `]
})
export class DashboardComponent {
  authService = inject(AuthService);
}