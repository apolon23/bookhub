import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { Book, BookForm } from '@app/core/models/book.model';
import { MatInputModule } from '@angular/material/input';
import { BookService } from '@app/core/services/book.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatInputModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookDetailsComponent {
  public bookForm!: FormGroup<BookForm>;

  public dialogRef: MatDialogRef<BookDetailsComponent> = inject(MatDialogRef);
  public data: Book = inject(MAT_DIALOG_DATA);
  private bookService = inject(BookService);
  private fb = inject(NonNullableFormBuilder);

  constructor() {
    this.createForm();
  }

  public onSave(): void {
    this.dialogRef.close({ ...this.bookForm.value, id: this.data.id });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public deleteBook(id: number): void {
    this.bookService.deleteBook(id);
    this.dialogRef.close();
  }

  private createForm(): void {
    this.bookForm = this.fb.group({
      title: this.fb.control(this.data.title, Validators.required),
      author: this.fb.control(this.data.author, Validators.required),
      year: this.fb.control(this.data.year, Validators.required),
      description: this.fb.control(this.data.description, Validators.required),
      coverImage: this.fb.control(this.data.coverImage)
    });
  }
}
