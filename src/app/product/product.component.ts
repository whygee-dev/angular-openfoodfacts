import { Component, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Product } from '../types';
import { NutrientLevelDirective } from '../directives/nutrient-level.directive';
import { LocalStorageService } from '../local-storage.service';
import { CapitalizePipe } from '../pipes/capitalize.pipe';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  imports: [CommonModule, NutrientLevelDirective, CapitalizePipe],
})
export class ProductComponent {
  constructor(
    private readonly apiService: ApiService,
    private readonly localStorageService: LocalStorageService
  ) {}

  product!: Promise<{ product: Product } | null>;

  @Input()
  set id(id: string) {
    this.product = firstValueFrom(this.apiService.getProduct(id));

    this.product.then((response) => {
      if (response?.product) {
        this.localStorageService.addToHistory(response.product.id);
      }

      return response?.product;
    });
  }
}
