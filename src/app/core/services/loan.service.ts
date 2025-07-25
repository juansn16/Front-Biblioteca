import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Loan {
  id: string;
  user_id: string;
  book_id: string;
  book?: {
    id: string;
    title: string;
    author: { name: string };
    cover_url: string;
  };
  loan_date: string;
  due_date: string;
  devuelto: boolean;
  return_date?: string;
  status?: 'active' | 'returned' | 'overdue';
  created_at: string;
  updated_at: string;
}

export interface CreateLoanRequest {
  user_id: string;
  book_id: string;
  due_date: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.API_URL + '/api';

  public myLoans = signal<Loan[]>([]);
  public isLoading = signal<boolean>(false);

  getMyLoans(): Observable<{ data: Loan[] }> {
    this.isLoading.set(true);
    return this.http.get<{ data: Loan[] }>(`${this.API_URL}/loans/my`)
      .pipe(
        tap(response => {
          this.myLoans.set(response.data);
          this.isLoading.set(false);
        })
      );
  }

  createLoan(loanRequest: CreateLoanRequest): Observable<Loan> {
    this.isLoading.set(true);
    return this.http.post<Loan>(`${this.API_URL}/loans`, loanRequest)
      .pipe(
        tap({
          next: (newLoan) => {
            this.myLoans.update(loans => [...loans, newLoan]);
            this.isLoading.set(false);
          },
          error: () => {
            this.isLoading.set(false);
          }
        })
      );
  }

  returnLoan(loanId: string): Observable<Loan> {
    const return_date = new Date().toISOString().split('T')[0];
    return this.http.put<Loan>(`${this.API_URL}/loans/${loanId}/return`, { return_date })
      .pipe(
        tap(returnedLoan => {
          this.myLoans.update(loans => 
            loans.map(loan => loan.id === loanId ? returnedLoan : loan)
          );
        })
      );
  }
} 