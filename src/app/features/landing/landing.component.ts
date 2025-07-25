import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing-container">
      <header class="header">
        <div class="header-content">
          <h1 class="title">
            📚 Biblioteca Digital
          </h1>
          <p class="subtitle">
            Gestiona tu colección de libros y préstamos de manera sencilla
          </p>
          
          <div class="action-buttons">
            <a routerLink="/login" class="btn btn-primary">
              Iniciar Sesión
            </a>
            <a routerLink="/register" class="btn btn-secondary">
              Registrarse
            </a>
          </div>
        </div>
      </header>

      <section class="features">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📖</div>
            <h3>Gestión de Libros</h3>
            <p>Administra tu colección completa de libros con información detallada</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>Control de Préstamos</h3>
            <p>Realiza seguimiento de todos los préstamos y devoluciones</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔐</div>
            <h3>Acceso Seguro</h3>
            <p>Sistema de autenticación robusto con diferentes niveles de acceso</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles:[`
    .landing-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 70vh;
      text-align: center;
      color: white;
      padding: 2rem;
    }

    .header-content {
      max-width: 600px;
    }

    .title {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      text-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .subtitle {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
      line-height: 1.6;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 2rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .btn-primary {
      background: white;
      color: #667eea;
    }

    .btn-primary:hover {
      background: #f8fafc;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border-color: white;
    }

    .btn-secondary:hover {
      background: white;
      color: #667eea;
      transform: translateY(-2px);
    }

    .features {
      padding: 4rem 2rem;
      background: white;
    }

    .features-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      text-align: center;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #374151;
      margin-bottom: 1rem;
    }

    .feature-card p {
      color: #6b7280;
      line-height: 1.6;
    }

    @media (max-width: 640px) {
      .title {
        font-size: 2.5rem;
      }
      
      .action-buttons {
        flex-direction: column;
        align-items: center;
      }
      
      .btn {
        width: 100%;
        max-width: 250px;
      }
    }
  `]
})
export class LandingComponent {}