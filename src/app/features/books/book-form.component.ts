import { Component, inject, OnInit, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { AuthorService } from '../../core/services/author.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { CreateBookRequest, UpdateBookRequest } from '../../core/models/book.interface';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h1 class="form-title">
          {{ isEditMode() ? '✏️ Editar Libro' : '📚 Agregar Nuevo Libro' }}
        </h1>
        <button (click)="goBack()" class="btn btn-secondary">
          ← Volver
        </button>
      </div>

      @if (isLoading()) {
        <app-loading-spinner></app-loading-spinner>
      } @else {
        <form class="book-form" (ngSubmit)="onSubmit()" #bookForm="ngForm">
          <div class="form-group">
            <label for="title" class="form-label">Título del Libro *</label>
            <input
              type="text"
              id="title"
              name="title"
              [(ngModel)]="formData.title"
              required
              class="form-input"
              placeholder="Ingresa el título del libro"
            >
          </div>

          <div class="form-group">
            <label for="author_id" class="form-label">Autor *</label>
            <select
              id="author_id"
              name="author_id"
              [(ngModel)]="formData.author_id"
              required
              class="form-select"
            >
              <option value="">Selecciona un autor</option>
              @for (author of authorService.authors(); track author.id) {
                <option [value]="author.id">{{ author.name }}</option>
              }
            </select>
            @if (authorService.authors().length === 0) {
              <p class="form-help">
                No hay autores disponibles. 
                <a href="/dashboard/authors/create" target="_blank" class="link">
                  Crear un autor primero
                </a>
              </p>
            }
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="publish_year" class="form-label">Año de Publicación *</label>
              <input
                type="number"
                id="publish_year"
                name="publish_year"
                [(ngModel)]="formData.publish_year"
                required
                min="1000"
                [max]="currentYear"
                class="form-input"
                placeholder="ej: 2023"
              >
            </div>

            <div class="form-group">
              <label for="copies" class="form-label">Número de Copias *</label>
              <input
                type="number"
                id="copies"
                name="copies"
                [(ngModel)]="formData.copies"
                required
                min="1"
                class="form-input"
                placeholder="ej: 5"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="cover_url" class="form-label">URL de la Portada</label>
            <input
              type="url"
              id="cover_url"
              name="cover_url"
              [(ngModel)]="formData.cover_url"
              class="form-input"
              placeholder="https://ejemplo.com/portada.jpg"
            >
            <p class="form-help">
              Opcional: URL de la imagen de portada del libro
            </p>
          </div>

          @if (formData.cover_url) {
            <div class="preview-container">
              <p class="preview-label">Vista previa de la portada:</p>
              <img 
                [src]="formData.cover_url" 
                alt="Preview"
                class="cover-preview"
                onerror="this.style.display='none'"
              >
            </div>
          }

          @if (errorMessage()) {
            <div class="alert alert-error">
              {{ errorMessage() }}
            </div>
          }

          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="bookForm.invalid || bookService.isLoading()"
            >
              @if (bookService.isLoading()) {
                <app-loading-spinner></app-loading-spinner>
              } @else {
                {{ isEditMode() ? 'Actualizar Libro' : 'Crear Libro' }}
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
      max-width: 800px;
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

    .book-form {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
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

    .form-input, .form-select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-help {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .link {
      color: #2563eb;
      text-decoration: none;
    }

    .link:hover {
      text-decoration: underline;
    }

    .preview-container {
      margin-bottom: 1.5rem;
    }

    .preview-label {
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .cover-preview {
      max-width: 200px;
      max-height: 300px;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class BookFormComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  bookService = inject(BookService);
  authorService = inject(AuthorService);

  isEditMode = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  currentYear = new Date().getFullYear();

  formData: CreateBookRequest = {
    title: '',
    author_id: '',
    publish_year: this.currentYear,
    copies: 1,
    cover_url: ''
  };

  @Input() book: any = null;
  @Input() editMode: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  ngOnInit(): void {
    this.loadAuthors();
    if (this.book) {
      this.isEditMode.set(true);
      this.formData = { ...this.book };
    } else {
      this.isEditMode.set(false);
      this.resetForm();
    }
  }

  loadAuthors(): void {
    this.authorService.getAuthors().subscribe({
      error: (error) => {
        this.errorMessage.set('Error al cargar los autores');
      }
    });
  }

  loadBook(id: string): void {
    this.isLoading.set(true);
    this.bookService.getBook(id).subscribe({
      next: (response) => {
        const book = response.data;
        this.formData = {
          title: book.title,
          author_id: book.author_id,
          publish_year: book.publish_year,
          copies: book.copies,
          cover_url: book.cover_url
        };
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error al cargar el libro');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    this.errorMessage.set('');
    if (this.isEditMode()) {
      this.bookService.updateBook(this.book.id, this.formData as UpdateBookRequest).subscribe({
        next: () => {
          this.saved.emit();
          this.resetForm();
        },
        error: (error) => {
          this.errorMessage.set('Error al actualizar el libro');
        }
      });
    } else {
      this.bookService.createBook(this.formData).subscribe({
        next: () => {
          this.saved.emit();
          this.resetForm();
        },
        error: (error) => {
          this.errorMessage.set('Error al crear el libro');
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
      title: '',
      author_id: '',
      publish_year: this.currentYear,
      copies: 1,
      cover_url: ''
    };
  }
}