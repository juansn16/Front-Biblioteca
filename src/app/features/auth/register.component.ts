import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">Registro</h1>
          <p class="auth-subtitle">Crea tu cuenta en la biblioteca</p>
        </div>

        <form class="auth-form" (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="name" class="form-label">Nombre Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="name"
              required
              class="form-input"
              [class.error]="nameError()"
              placeholder="Tu nombre completo"
            >
            @if (nameError()) {
              <span class="error-message">{{ nameError() }}</span>
            }
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              class="form-input"
              [class.error]="emailError()"
              placeholder="tu@email.com"
            >
            @if (emailError()) {
              <span class="error-message">{{ emailError() }}</span>
            }
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              class="form-input"
              [class.error]="passwordError()"
              placeholder="••••••••"
            >
            @if (passwordError()) {
              <span class="error-message">{{ passwordError() }}</span>
            }
          </div>

          <div class="info-note">
            <p>
              📝 <strong>Nota:</strong> Todas las cuentas nuevas se registran con rol de administrador. 
              El sistema determinará automáticamente si procede otorgar permisos administrativos.
            </p>
          </div>

          @if (serverError()) {
            <div class="alert alert-error">
              {{ serverError() }}
            </div>
          }

          <button
            type="submit"
            class="btn btn-primary btn-full"
            [disabled]="authService.isLoading() || registerForm.invalid"
          >
            @if (authService.isLoading()) {
              <app-loading-spinner></app-loading-spinner>
            } @else {
              Crear Cuenta
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>
            ¿Ya tienes cuenta?
            <a routerLink="/login" class="auth-link">Inicia sesión aquí</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .auth-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
      padding: 2.5rem;
      width: 100%;
      max-width: 450px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-title {
      font-size: 2rem;
      font-weight: 700;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .auth-subtitle {
      color: #6b7280;
      font-size: 1rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-label {
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    .form-input {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
    }

    .info-note {
      background: #fef3c7;
      border: 1px solid #fcd34d;
      border-radius: 0.5rem;
      padding: 1rem;
      font-size: 0.875rem;
    }

    .info-note p {
      margin: 0;
      color: #92400e;
      line-height: 1.4;
    }

    .alert {
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
    }

    .alert-error {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .btn {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1rem;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #1d4ed8;
    }

    .btn-primary:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .btn-full {
      width: 100%;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    .auth-link {
      color: #2563eb;
      text-decoration: none;
      font-weight: 500;
    }

    .auth-link:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  authService = inject(AuthService);

  name = '';
  email = '';
  password = '';
  
  nameError = signal<string>('');
  emailError = signal<string>('');
  passwordError = signal<string>('');
  serverError = signal<string>('');

  onSubmit(): void {
    this.clearErrors();
    
    if (!this.validateForm()) {
      return;
    }

    this.authService.register({ 
      name: this.name, 
      email: this.email, 
      password: this.password,
      role: 'admin' 
    }).subscribe({
      error: (error) => {
        this.serverError.set(error.message || 'Error al crear la cuenta');
      }
    });
  }

  private validateForm(): boolean {
    let isValid = true;

    if (!this.name.trim()) {
      this.nameError.set('El nombre es requerido');
      isValid = false;
    } else if (this.name.trim().length < 2) {
      this.nameError.set('El nombre debe tener al menos 2 caracteres');
      isValid = false;
    }

    if (!this.email) {
      this.emailError.set('El email es requerido');
      isValid = false;
    } else if (!this.isValidEmail(this.email)) {
      this.emailError.set('Ingresa un email válido');
      isValid = false;
    }

    if (!this.password) {
      this.passwordError.set('La contraseña es requerida');
      isValid = false;
    } else if (this.password.length < 6) {
      this.passwordError.set('La contraseña debe tener al menos 6 caracteres');
      isValid = false;
    }

    return isValid;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private clearErrors(): void {
    this.nameError.set('');
    this.emailError.set('');
    this.passwordError.set('');
    this.serverError.set('');
  }
}