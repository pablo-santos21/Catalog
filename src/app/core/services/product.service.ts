import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';
import { PagedResult } from './paged-result';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:5062/v1/products';

  constructor(private client: HttpClient) {}

  getProduct(): Observable<Product[]> {
    return this.client.get<Product[]>(`${this.apiUrl}/full`);
  }

  getProductsByUser(userId: string): Observable<Product[]> {
    return this.client.get<Product[]>(`${this.apiUrl}/byUser?userId=${userId}`);
  }

  GetProductByNameAsync(slug: string): Observable<Product> {
    return this.client.get<Product>(`${this.apiUrl}/${slug}`);
  }

  GetAllProductsAsync(
    page: number,
    pageSize: number
  ): Observable<PagedResult<Product>> {
    let params = new HttpParams()
      .set('pageIndex', page)
      .set('pageSize', pageSize);
    return this.client.get<PagedResult<Product>>(`${this.apiUrl}/produtoecat`, {
      params,
    });
  }

  getProducts(
    page: number,
    pageSize: number
  ): Observable<PagedResult<Product>> {
    let params = new HttpParams()
      .set('pageIndex', page)
      .set('pageSize', pageSize);
    return this.client.get<PagedResult<Product>>(this.apiUrl, { params });
  }

  addProduct(product: Product): Observable<Product> {
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.client.post<Product>(this.apiUrl, product, { headers });
  }

  updateProduct(product: Product): Observable<Product> {
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.client.put<Product>(`${this.apiUrl}/${product.id}`, product, {
      headers,
    });
  }

  deleteProduct(id: number): Observable<string> {
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.client.delete<string>(`${this.apiUrl}/${id}`, { headers });
  }
}
