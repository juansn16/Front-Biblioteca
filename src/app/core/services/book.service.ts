import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { Book } from '../models/book.interface';
import { Author } from '../models/author.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.API_URL + '/api';

  public books = signal<Book[]>([]);
  public isLoading = signal<boolean>(false);

  getBooks(): Observable<Book[]> {
    this.isLoading.set(true);
    return this.http.get<any>(`${this.API_URL}/books/`)
      .pipe(
        map(response => (response.data || []).map((book: any) => ({
          ...book,
          available_copies: Number(book.available_copies),
          copies: Number(book.copies)
        }))),
        tap(books => {
          this.books.set(books);
          this.isLoading.set(false);
        })
      );
  }

  getBook(id: string): Observable<{ data: Book }> {
    return this.http.get<{ data: Book }>(`${this.API_URL}/books/${id}`);
  }

  createBook(book: Partial<Book>): Observable<Book> {
    return this.http.post<Book>(`${this.API_URL}/books`, book)
      .pipe(
        tap(newBook => {
          this.books.update(books => [...books, newBook]);
        })
      );
  }

  updateBook(id: string, book: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.API_URL}/books/${id}`, book)
      .pipe(
        tap(updatedBook => {
          this.books.update(books => 
            books.map(b => b.id === id ? updatedBook : b)
          );
        })
      );
  }

  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/books/${id}`)
      .pipe(
        tap(() => {
          this.books.update(books => books.filter(b => b.id !== id));
        })
      );
  }

  getAuthor(id: string): Observable<{ data: Author }> {
    return this.http.get<{ data: Author }>(`${this.API_URL}/author/${id}`);
  }
} 