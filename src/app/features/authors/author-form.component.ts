import { Component, inject, OnInit, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthorService } from '../../core/services/author.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { CreateAuthorRequest, UpdateAuthorRequest } from '../../core/models/book.interface';

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h1 class="form-title">
          {{ editMode ? '✏️ Editar Autor' : '✍️ Agregar Nuevo Autor' }}
        </h1>
        <button (click)="goBack()" class="btn btn-secondary">
          ← Volver
        </button>
      </div>

      @if (isLoading()) {
        <app-loading-spinner></app-loading-spinner>
      } @else {
        <form class="author-form" (ngSubmit)="onSubmit()" #authorForm="ngForm">
          <div class="form-group">
            <label for="name" class="form-label">Nombre del Autor *</label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="formData.name"
              required
              class="form-input"
              placeholder="Ingresa el nombre completo del autor"
            >
          </div>

          <div class="form-group">
            <label for="bio" class="form-label">Biografía</label>
            <textarea
              id="bio"
              name="bio"
              [(ngModel)]="formData.bio"
              rows="6"
              class="form-textarea"
              placeholder="Escribe una breve biografía del autor (opcional)"
            ></textarea>
            <p class="form-help">
              Información sobre la vida y obra del autor
            </p>
          </div>

          @if (errorMessage()) {
            <div class="alert alert-error">
              {{ errorMessage() }}
            </div>
          }

          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="authorForm.invalid || authorService.isLoading()"
            >
              @if (authorService.isLoading()) {
                <app-loading-spinner></app-loading-spinner>
              } @else {
                {{ editMode ? 'Actualizar Autor' : 'Crear Autor' }}
              }
            </button>
            
            <button
              type="button"
              (click)="goBack()"
              class="btn btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .form-title {
      font-size: 2rem;
      font-weight: 700;
      color: #374151;
    }

    .author-form {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .form-input, .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }

    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 120px;
    }

    .form-help {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .alert {
      padding: 0.75rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .alert-error {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
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

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    @media (max-width: 640px) {
      .form-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AuthorFormComponent implements OnInit {
  @Input() author: any = null;
  @Input() editMode: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  authorService = inject(AuthorService);
  isLoading = signal(false);
  errorMessage = signal('');

  formData: CreateAuthorRequest = {
    name: '',
    bio: ''
  };

  ngOnInit(): void {
    if (this.author) {
      this.editMode = true;
      this.formData = { ...this.author };
    } else {
      this.editMode = false;
      this.resetForm();
    }
  }

  onSubmit(): void {
    this.errorMessage.set('');
    if (this.editMode) {
      this.authorService.updateAuthor(this.author.id, this.formData as UpdateAuthorRequest).subscribe({
        next: () => {
          this.saved.emit();
          this.resetForm();
        },
        error: (error) => {
          this.errorMessage.set('Error al actualizar el autor');
        }
      });
    } else {
      this.authorService.createAuthor(this.formData).subscribe({
        next: () => {
          this.saved.emit();
          this.resetForm();
        },
        error: (error) => {
          this.errorMessage.set('Error al crear el autor');
        }
      });
    }
  }

  goBack(): void {
    this.close.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      name: '',
      bio: ''
    };
  }
}