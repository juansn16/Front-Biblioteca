import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1 class="page-title">👤 Mi Perfil</h1>
      </div>
      <div class="profile-card">
        <div class="profile-info">
          <div class="profile-avatar">
            {{ getInitials() }}
          </div>
          <div class="profile-details">
            <h2 class="profile-name">{{ authService.currentUser()?.name }}</h2>
            <p class="profile-email">{{ authService.currentUser()?.email }}</p>
            <span class="profile-role" [class.admin]="authService.isAdmin()">
              {{ authService.currentUser()?.role === 'admin' ? 'Administrador' : 'Usuario' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .profile-header {
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: #374151;
    }

    .profile-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }

    .profile-info {
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .profile-avatar {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      backdrop-filter: blur(10px);
    }

    .profile-details {
      flex: 1;
    }

    .profile-name {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .profile-email {
      font-size: 1rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
    }

    .profile-role {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .profile-role.admin {
      background: rgba(251, 191, 36, 0.9);
      color: #92400e;
    }

    @media (max-width: 640px) {
      .profile-info {
        flex-direction: column;
        text-align: center;
      }
      
      .profile-avatar {
        margin-bottom: 1rem;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit(): void {}

  getInitials(): string {
    const user = this.authService.currentUser();
    if (!user?.name) return 'U';
    
    return user.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}