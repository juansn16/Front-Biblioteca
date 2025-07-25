import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService, Loan } from '../../core/services/loan.service';
import { BookService } from '../../core/services/book.service';

@Component({
  selector: 'app-loans-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loans-container">
      <div class="loans-header">
        <h1 class="page-title">📋 Mis Préstamos</h1>
      </div>
      <div *ngIf="loanService.isLoading()">Cargando préstamos...</div>
      <div class="loans-list" *ngIf="!loanService.isLoading()">
        <div class="loan-card" *ngFor="let loan of loanService.myLoans(); trackBy: trackByLoan">
          <div class="loan-book">
            <img *ngIf="loan.book" [src]="loan.book.cover_url" [alt]="getBookTitle(loan.book)" class="book-cover"
                 onerror="this.src='https://via.placeholder.com/80x120?text=Sin+Imagen'">
            <div class="book-info">
              <h3 class="book-title">{{ loan.book?.title || 'Sin título' }}</h3>
              <p class="book-author">{{ loan.book?.author?.name || 'Autor desconocido' }}</p>
            </div>
          </div>
          <div class="loan-info">
            <div class="loan-dates">
              <div class="date-item">
                <span class="date-label">Préstamo:</span>
                <span class="date-value">{{ formatDate(loan.loan_date) }}</span>
              </div>
              <div class="date-item">
                <span class="date-label">Vencimiento:</span>
                <span class="date-value">{{ formatDate(loan.due_date) }}</span>
              </div>
              <div class="date-item" *ngIf="loan.devuelto">
                <span class="date-label">Devuelto:</span>
                <span class="date-value returned">{{ formatDate(loan.return_date) }}</span>
              </div>
            </div>
            <div class="loan-status">
              <span *ngIf="loan.devuelto" class="status-badge returned">✅ Devuelto</span>
              <button *ngIf="!loan.devuelto" (click)="returnLoan(loan)" class="btn btn-primary" [disabled]="loanService.isLoading()">
                📤 Devolver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loans-container { padding: 2rem; }
    .loans-header { margin-bottom: 2rem; }
    .loans-list { display: flex; flex-direction: column; gap: 2rem; }
    .loan-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 1.5rem; display: flex; flex-direction: row; align-items: flex-start; }
    .loan-book { margin-right: 2rem; }
    .book-cover { width: 80px; height: 120px; object-fit: cover; border-radius: 6px; }
    .book-title { font-size: 1.1rem; font-weight: bold; margin: 0.5rem 0; }
    .book-author { color: #666; margin: 0; }
    .loan-info { flex: 1; }
    .loan-dates { margin-bottom: 1rem; }
    .date-label { font-weight: bold; }
    .date-value { margin-left: 0.5rem; }
    .date-value.returned { color: #059669; }
    .loan-status { margin-bottom: 1rem; }
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 6px; font-weight: bold; }
    .status-badge.active { background: #dbeafe; color: #2563eb; }
    .status-badge.returned { background: #d1fae5; color: #059669; }
    .status-badge.overdue { background: #fee2e2; color: #e11d48; }
    .loan-actions { display: flex; align-items: center; }
    .btn { padding: 0.5rem 1.5rem; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; background: #2563eb; color: #fff; }
    .returned-text { color: #059669; font-weight: bold; }
  `]
})
export class LoansListComponent implements OnInit {
  loanService = inject(LoanService);
  bookService = inject(BookService);

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loanService.getMyLoans().subscribe({
      next: () => {
        const loans = this.loanService.myLoans();
        for (const loan of loans) {
          if (!loan.book) {
            this.bookService.getBook(loan.book_id).subscribe(response => {
              const book = response.data;
              loan.book = {
                id: book.id,
                title: book.title,
                author: { name: '' }, // temporal
                cover_url: book.cover_url
              };
              this.bookService.getAuthor(book.author_id).subscribe(authorResp => {
                loan.book!.author.name = authorResp.data.name;
              });
            });
          }
        }
      }
    });
  }

  returnLoan(loan: Loan): void {
    this.loanService.returnLoan(loan.id).subscribe({
      next: () => {
        this.loadLoans();
      }
    });
  }

  formatDate(dateString?: string): string {
    return dateString ? new Date(dateString).toLocaleDateString('es-ES') : '';
  }

  getBookTitle(book: any): string {
    return book?.title || 'Portada libro';
  }

  trackByLoan(index: number, loan: Loan) {
    return loan.id;
  }
}