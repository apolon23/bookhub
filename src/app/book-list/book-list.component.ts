import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { BookDetailsComponent } from '../book-details/book-details.component';
import { BookService } from '@app/core/services/book.service';
import { Book } from '@app/core/models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [AsyncPipe, NgIf, MatTableModule, MatButtonModule,
    MatListModule, MatInputModule, BookDetailsComponent, ReactiveFormsModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookListComponent implements OnInit {
  private dialog = inject(MatDialog);
  private bookService = inject(BookService);

  public filteredBooks$: Observable<Book[]> = this.bookService.books$;
  public searchControl: FormControl<string | null> = new FormControl('');

  public ngOnInit(): void {
    this.subscribeOnSearchChanges();
  }

  public openDetails(book: Book): void {
    const dialogRef: MatDialogRef<BookDetailsComponent> = this.dialog.open(BookDetailsComponent, {
      data: book
    });

    dialogRef.afterClosed().subscribe((result: Book) => {
      if (result) {
        this.bookService.updateBook(result);
      }
    });
  }

  public addBook(): void {
    const newBook: Book = {
      id: this.bookService.getNextId(),
      title: '',
      author: '',
      year: new Date().getFullYear(),
      description: ''
    }
    this.openDetails(newBook)
  }

  public deleteBook(id: number): void {
    this.bookService.deleteBook(id);
  }

  private subscribeOnSearchChanges(): void {
    this.searchControl.valueChanges.subscribe((value: string | null) => {
      this.filteredBooks$ = this.bookService.searchBooks(value || '');
    })
  }
}
