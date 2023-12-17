import { Component } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import { ApiService } from '../api.service';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../search/card/card.component';
import { HistoryItem, Product } from '../types';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, CardComponent, ReactiveFormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly apiService: ApiService
  ) {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.filterProducts();
      });
  }

  searchControl = new FormControl('');

  products: Product[] = [];

  async ngOnInit() {
    this.products = (await this.getHistory()) ?? [];
  }

  async filterProducts() {
    if (!this.searchControl.value) {
      this.products = await this.getHistory();
      return;
    }

    this.products = (await this.getHistory()).filter((product) => {
      return product.product_name
        .toLowerCase()
        .includes(this.searchControl.value!.toLowerCase());
    });
  }

  async getHistory() {
    return (
      await Promise.all(
        this.localStorageService
          .getHistory()
          ?.sort((a, b) => b.timestamp - a.timestamp)
          .map(({ id }) => {
            return firstValueFrom(this.apiService.getProduct(id));
          }) ?? []
      )
    )
      .filter((product): product is { product: Product } => !!product)
      .map(({ product }) => product);
  }
}
