import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { Author, CreateAuthorRequest, UpdateAuthorRequest } from '../models/book.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.API_URL + '/api';

  public authors = signal<Author[]>([]);
  public isLoading = signal<boolean>(false);

  getAuthors(): Observable<Author[]> {
    this.isLoading.set(true);
    return this.http.get<any>(`${this.API_URL}/author`)
      .pipe(
        tap(response => {
          this.authors.set(response.data || []);
          this.isLoading.set(false);
        }),
        map(response => response.data || [])
      );
  }

  getAuthor(id: string): Observable<Author> {
    return this.http.get<Author>(`${this.API_URL}/author/${id}`);
  }

  createAuthor(author: CreateAuthorRequest): Observable<Author> {
    return this.http.post<Author>(`${this.API_URL}/author`, author)
      .pipe(
        tap(newAuthor => {
          this.authors.update(authors => [...authors, newAuthor]);
        })
      );
  }

  updateAuthor(id: string, author: UpdateAuthorRequest): Observable<Author> {
    return this.http.put<Author>(`${this.API_URL}/author/${id}`, author)
      .pipe(
        tap(updatedAuthor => {
          this.authors.update(authors => 
            authors.map(a => a.id === id ? updatedAuthor : a)
          );
        })
      );
  }

  deleteAuthor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/author/${id}`)
      .pipe(
        tap(() => {
          this.authors.update(authors => authors.filter(a => a.id !== id));
        })
      );
  }
}