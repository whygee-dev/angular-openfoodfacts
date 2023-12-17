import { Component } from '@angular/core';
import { CardComponent } from './card/card.component';
import { ApiService } from '../api.service';
import { Product } from '../types';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  searchControl = new FormControl('');

  constructor(private readonly apiService: ApiService) {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.searchProducts();
      });
  }

  products: Product[] = [];

  async searchProducts() {
    if (!this.searchControl.value) {
      return;
    }

    console.log('Searching for:', this.searchControl.value);

    this.products = await firstValueFrom(
      this.apiService.searchProducts(this.searchControl.value)
    );
  }
}
