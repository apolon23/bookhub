import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, take } from 'rxjs';

import { Book } from '@app/core/models/book.model';
import { BookList } from '@app/core/book.constants';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private books: Book[] = BookList;
  private booksSubject: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>(this.books);
  public books$: Observable<Book[]> = this.booksSubject.asObservable();

  public updateBook(updatedBook: Book): void {
    const index: number = this.books.findIndex((book: Book) => book.id === updatedBook.id);
    if (index > -1) {
      this.books[index] = updatedBook;
      this.booksSubject.next([...this.books]);
    } else {
      this.addBook(updatedBook);
    }
  }

  public deleteBook(id: number): void {
    this.books = this.books.filter(book => book.id !== id);
    this.booksSubject.next([...this.books]);
  }

  public searchBooks(searchTerm: string): Observable<Book[]> {
    return this.books$.pipe(
      map((books: Book[]) =>
        books.filter((book: Book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  public getNextId(): number {
    let nextId: number = 1;
    this.books$.pipe(take(1)).subscribe((books: Book[]) => {
      if (books.length > 0) {
        nextId = Math.max(...books.map((book: Book) => book.id)) + 1;
      }
    });
    return nextId;
  }

  private addBook(book: Book): void {
    this.books.push(book);
    this.booksSubject.next([...this.books]);
  }
}
