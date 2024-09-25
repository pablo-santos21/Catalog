import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:5062/v1/products';

  constructor(private client: HttpClient) {}

  getProduct(): Observable<Product[]> {
    return this.client.get<Product[]>(`${this.apiUrl}/test`);
  }

  // Método para obter uma categoria por ID
  getProductById(id: number): Observable<Product> {
    return this.client.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Método para adicionar uma nova categoria
  addProduct(product: Product): Observable<Product> {
    const token = localStorage.getItem('Bearer'); // Obtém o token JWT do localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho Authorization
    });

    return this.client.post<Product>(this.apiUrl, product, {
      headers,
    });
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

  // Método para excluir uma categoria
  deleteProduct(id: number): Observable<string> {
    const token = localStorage.getItem('Bearer'); // Obtém o token JWT do localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho Authorization
    });
    return this.client.delete<string>(`${this.apiUrl}/${id}`, { headers });
  }
}
