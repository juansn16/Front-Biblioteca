import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { LoanService } from '../../core/services/loan.service';
import { AuthService } from '../../core/auth/auth.service';
import { BookFormComponent } from './book-form.component';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, RouterModule, BookFormComponent],
  template: `
    <div class="books-container">
      <div class="books-header">
        <h1 class="page-title">📚 Libros Disponibles</h1>
        @if (authService.isAdmin()) {
          <button class="btn btn-success" (click)="openAddBookModal()">➕ Agregar libro</button>
        }
      </div>

      <!-- Modal clásico para agregar/editar libro -->
      @if (showBookModal()) {
        <div class="modal-backdrop" (click)="closeBookModal()"></div>
        <div class="modal-window">
          <app-book-form
            [book]="selectedBook()"
            [editMode]="isEditMode()"
            (close)="closeBookModal()"
            (saved)="onBookSaved()"
          ></app-book-form>
        </div>
      }

      <!-- Modal de confirmación para eliminar libro -->
      @if (showDeleteModal()) {
        <div class="modal-backdrop" (click)="closeDeleteModal()"></div>
        <div class="modal-window">
          <h2>¿Estás seguro de que deseas eliminar este libro?</h2>
          <p><strong>{{ selectedBook()?.title }}</strong></p>
          <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button class="btn btn-danger" (click)="deleteBookConfirmed()">Sí, eliminar</button>
            <button class="btn btn-secondary" (click)="closeDeleteModal()">Cancelar</button>
          </div>
        </div>
      }

      @if (bookService.isLoading()) {
        <div>Cargando libros...</div>
      } @else {
        <div class="books-grid">
          @for (book of bookService.books(); track book.id) {
            <div class="book-card">
              <div class="book-cover">
                <img [src]="book.cover_url" [alt]="book.title" onerror="this.src='https://via.placeholder.com/200x300?text=Sin+Imagen'">
              </div>
              <div class="book-info">
                <h3 class="book-title">{{ book.title }}</h3>
                <p class="book-author">{{ book.author?.name || 'Autor desconocido' }}</p>
                <p class="book-year">Año: {{ book.publish_year }}</p>
                <div class="book-availability">
                  <span class="availability-label">Disponibles:</span>
                  <span class="availability-count" [class.low]="book.available_copies < 3" [class.none]="book.available_copies === 0">
                    {{ book.available_copies }} / {{ book.copies }}
                  </span>
                </div>
              </div>
              <div class="book-actions">
                @if (book.available_copies > 0) {
                  <button (click)="createLoan(book)" class="btn btn-primary btn-full" [disabled]="loanService.isLoading()">
                    📖 Realizar Préstamo
                  </button>
                } @else {
                  <button class="btn btn-disabled btn-full" disabled>
                    ❌ No Disponible
                  </button>
                }
                @if (authService.isAdmin()) {
                  <div class="admin-actions">
                    <button class="btn btn-warning" (click)="openEditBookModal(book)">✏️ Editar</button>
                    <button class="btn btn-danger" (click)="confirmDeleteBook(book)">🗑️ Eliminar</button>
                  </div>
                }
              </div>
            </div>
          }
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
    .books-container { padding: 2rem; }
    .books-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; }
    .books-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
    .book-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 1.5rem; display: flex; flex-direction: column; align-items: center; }
    .book-cover img { width: 120px; height: 180px; object-fit: cover; border-radius: 6px; }
    .book-title { font-size: 1.2rem; font-weight: bold; margin: 0.5rem 0; }
    .book-author, .book-year { color: #666; margin: 0; }
    .book-availability { margin: 1rem 0; }
    .availability-label { font-weight: bold; }
    .availability-count { font-weight: bold; color: #059669; }
    .availability-count.low { color: #f59e42; }
    .availability-count.none { color: #e11d48; }
    .book-actions { margin-top: 1rem; width: 100%; }
    .btn { width: 100%; padding: 0.75rem; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; }
    .btn-primary { background: #2563eb; color: #fff; }
    .btn-disabled { background: #f3f4f6; color: #e11d48; cursor: not-allowed; }
    .btn-success { background: #059669; color: #fff; margin-left: 1rem; }
    .btn-warning { background: #f59e42; color: #fff; margin-top: 0.5rem; }
    .btn-danger { background: #e11d48; color: #fff; margin-top: 0.5rem; }
    .admin-actions { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem; }
    .success-toast { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
    .error-toast { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
    /* Estilos para el modal clásico */
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
  `]
})
export class BooksListComponent implements OnInit {
  bookService = inject(BookService);
  loanService = inject(LoanService);
  authService = inject(AuthService);

  showSuccessMessage = signal(false);
  showErrorMessage = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  // Estado y lógica para el modal de libro
  showBookModal = signal(false);
  isEditMode = signal(false);
  selectedBook = signal<any>(null);

  // Estado y lógica para el modal de confirmación de borrado
  showDeleteModal = signal(false);

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        for (const book of books) {
          this.bookService.getAuthor(book.author_id).subscribe(authorResp => {
            book.author = authorResp.data;
          });
        }
      },
      error: () => {
        this.showError('Error al cargar los libros');
      }
    });
  }

  createLoan(book: any): void {
    if (book.available_copies === 0) {
      this.showError('Este libro no está disponible');
      return;
    }
    const user_id = this.authService.getUserId();
    if (!user_id) {
      this.showError('No se pudo obtener el usuario autenticado');
      return;
    }
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const due_date = dueDate.toISOString().split('T')[0];
    this.loanService.createLoan({ user_id, book_id: book.id, due_date }).subscribe({
      next: () => {
        this.showSuccess('Préstamo realizado exitosamente');
        this.loadBooks();
      },
      error: () => {
        this.showError('Error al realizar el préstamo');
      }
    });
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

  // Métodos para abrir modales y eliminar libros
  openAddBookModal(): void {
    this.selectedBook.set(null);
    this.isEditMode.set(false);
    this.showBookModal.set(true);
  }

  openEditBookModal(book: any): void {
    this.selectedBook.set(book);
    this.isEditMode.set(true);
    this.showBookModal.set(true);
  }

  closeBookModal(): void {
    this.showBookModal.set(false);
  }

  onBookSaved(): void {
    this.closeBookModal();
    this.loadBooks();
  }

  confirmDeleteBook(book: any): void {
    this.selectedBook.set(book);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedBook.set(null);
  }

  deleteBookConfirmed(): void {
    const book = this.selectedBook();
    if (!book) return;
    this.bookService.deleteBook(book.id).subscribe({
      next: () => {
        this.showSuccess('Libro eliminado correctamente');
        this.loadBooks();
        this.closeDeleteModal();
      },
      error: () => {
        this.showError('Error al eliminar el libro');
        this.closeDeleteModal();
      }
    });
  }
} 