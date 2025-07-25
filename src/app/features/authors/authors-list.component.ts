import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthorService } from '../../core/services/author.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { Author } from '../../core/models/book.interface';
import { AuthService } from '../../core/auth/auth.service';
import { AuthorFormComponent } from './author-form.component';

@Component({
  selector: 'app-authors-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, AuthorFormComponent],
  template: `
    <div class="authors-container">
      <div class="authors-header">
        <h1 class="page-title">✍️ Gestión de Autores</h1>
        @if (authService.isAdmin()) {
          <button class="btn btn-primary" (click)="openAddAuthorModal()">+ Agregar Autor</button>
        }
      </div>

      <!-- Modal clásico para agregar/editar autor -->
      @if (showAuthorModal()) {
        <div class="modal-backdrop" (click)="closeAuthorModal()"></div>
        <div class="modal-window">
          <app-author-form
            [author]="selectedAuthor()"
            [editMode]="isEditMode()"
            (close)="closeAuthorModal()"
            (saved)="onAuthorSaved()"
          ></app-author-form>
        </div>
      }

      <!-- Modal de confirmación para eliminar autor -->
      @if (showDeleteModal()) {
        <div class="modal-backdrop" (click)="closeDeleteModal()"></div>
        <div class="modal-window confirm-modal">
          <div class="confirm-icon">⚠️</div>
          <h2 class="confirm-title">¿Eliminar autor?</h2>
          <p class="confirm-message">Esta acción no se puede deshacer.<br><strong>{{ selectedAuthor()?.name }}</strong></p>
          <div class="confirm-actions">
            <button class="btn btn-danger" (click)="deleteAuthorConfirmed()">Sí, eliminar</button>
            <button class="btn btn-secondary" (click)="closeDeleteModal()">Cancelar</button>
          </div>
        </div>
      }

      @if (authorService.isLoading()) {
        <app-loading-spinner></app-loading-spinner>
      } @else {
        <div class="authors-grid">
          @for (author of authorService.authors(); track author.id) {
            <div class="author-card">
              <div class="author-avatar">
                {{ getInitials(author.name) }}
              </div>
              
              <div class="author-info">
                <h3 class="author-name">{{ author.name }}</h3>
                <p class="author-bio">{{ author.bio || 'Sin biografía disponible' }}</p>
                <p class="author-date">
                  Agregado: {{ formatDate(author.created_at) }}
                </p>
              </div>

              <div class="author-actions">
                @if (authService.isAdmin()) {
                  <button class="btn btn-secondary" (click)="openEditAuthorModal(author)">✏️ Editar</button>
                  <button (click)="confirmDeleteAuthor(author)" class="btn btn-danger">
                    🗑️ Eliminar
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }

      @if (authorService.authors().length === 0 && !authorService.isLoading()) {
        <div class="empty-state">
          <h3>No hay autores registrados</h3>
          <p>Comienza agregando autores a tu biblioteca.</p>
          <a routerLink="/dashboard/authors/create" class="btn btn-primary">
            + Agregar el primer autor
          </a>
        </div>
      }

      @if (showSuccessMessage()) {
        <div class="success-toast">
          {{ successMessage() }}
        </div>
      }

      @if (showErrorMessage()) {
        <div class="error-toast">
          {{ errorMessage() }}
        </div>
      }
    </div>
  `,
  styles: [`
    .authors-container {
      position: relative;
    }

    .authors-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: #374151;
    }

    .authors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .author-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .author-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .author-avatar {
      width: 64px;
      height: 64px;
      background: #2563eb;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .author-info {
      margin-bottom: 2rem;
    }

    .author-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: #374151;
      margin-bottom: 1rem;
    }

    .author-bio {
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .author-date {
      color: #9ca3af;
      font-size: 0.875rem;
    }

    .author-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      text-align: center;
      transition: all 0.2s;
      font-size: 0.875rem;
      flex: 1;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
    }

    .btn-primary:hover {
      background: #1d4ed8;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #374151;
    }

    .success-toast, .error-toast {
      position: fixed;
      top: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    }

    .success-toast {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }

    .error-toast {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .authors-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .authors-grid {
        grid-template-columns: 1fr;
      }
    }

    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.4);
      z-index: 1000;
    }
    .modal-window {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 32px #0003;
      padding: 2rem;
      z-index: 1001;
      min-width: 350px;
      max-width: 95vw;
      max-height: 90vh;
      overflow-y: auto;
    }
    .confirm-modal {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2.5rem 2rem 2rem 2rem;
    }
    .confirm-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    .confirm-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: #e11d48;
      margin-bottom: 0.5rem;
    }
    .confirm-message {
      color: #374151;
      margin-bottom: 2rem;
    }
    .confirm-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      width: 100%;
    }
    .btn-danger {
      background: #e11d48;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-danger:hover {
      background: #be123c;
    }
    .btn-secondary {
      background: #6b7280;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-secondary:hover {
      background: #374151;
    }
  `]
})
export class AuthorsListComponent implements OnInit {
  authorService = inject(AuthorService);

  showSuccessMessage = signal(false);
  showErrorMessage = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  // Estado y lógica para los modales y acciones de autor
  authService = inject(AuthService);
  showAuthorModal = signal(false);
  isEditMode = signal(false);
  selectedAuthor = signal<any>(null);
  showDeleteModal = signal(false);

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.authorService.getAuthors().subscribe({
      error: (error) => {
        this.showError('Error al cargar los autores');
      }
    });
  }

  openAddAuthorModal(): void {
    this.selectedAuthor.set(null);
    this.isEditMode.set(false);
    this.showAuthorModal.set(true);
  }

  openEditAuthorModal(author: any): void {
    this.selectedAuthor.set(author);
    this.isEditMode.set(true);
    this.showAuthorModal.set(true);
  }

  closeAuthorModal(): void {
    this.showAuthorModal.set(false);
  }

  onAuthorSaved(): void {
    this.closeAuthorModal();
    this.loadAuthors();
  }

  confirmDeleteAuthor(author: any): void {
    this.selectedAuthor.set(author);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedAuthor.set(null);
  }

  deleteAuthorConfirmed(): void {
    const author = this.selectedAuthor();
    if (!author) return;
    this.authorService.deleteAuthor(author.id).subscribe({
      next: () => {
        this.showSuccess('Autor eliminado correctamente');
        this.loadAuthors();
        this.closeDeleteModal();
      },
      error: () => {
        this.showError('Error al eliminar el autor');
        this.closeDeleteModal();
      }
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES');
  }

  private showSuccess(message: string): void {
    this.successMessage.set(message);
    this.showSuccessMessage.set(true);
    setTimeout(() => this.showSuccessMessage.set(false), 3000);
  }

  private showError(message: string): void {
    this.errorMessage.set(message);
    this.showErrorMessage.set(true);
    setTimeout(() => this.showErrorMessage.set(false), 3000);
  }
}