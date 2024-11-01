import { FormControl } from '@angular/forms';

export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  description: string;
  coverImage?: string;
}

export type BookForm = {
  title: FormControl<string>;
  author: FormControl<string>;
  year: FormControl<number>;
  description: FormControl<string>;
  coverImage: FormControl<string | undefined>;
};
