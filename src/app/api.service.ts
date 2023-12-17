import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from './types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiBase = 'https://world.openfoodfacts.net';
  private apiSearchUrl = `${this.apiBase}/cgi/search.pl`;
  private apiProductUrl = `${this.apiBase}/api/v2/product/`;

  constructor(private http: HttpClient) {}

  searchProducts(query: string): Observable<Product[]> {
    const params = new HttpParams()
      .set('action', 'process')
      .set('json', 'true')
      .set('search_terms', query)
      .set('page_size', '10');

    return this.http.get<Product[]>(this.apiSearchUrl, { params }).pipe(
      map((response: any) => {
        return response.products;
      }),
      catchError((error: any) => {
        console.error('Error fetching products:', error);
        throw error;
      })
    );
  }

  getProduct(id: string): Observable<{ product: Product } | null> {
    const params = new HttpParams().set('json', 'true');

    return this.http.get<{ product: Product } | null>(
      `${this.apiProductUrl}${id}.json`,
      {
        params,
      }
    );
  }
}
