import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../../models/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:5062/v1/categories';

  constructor(private client: HttpClient) {}

  // category$?: Observable<Category[]>;

  getCategory(): Observable<Category[]> {
    return this.client.get<Category[]>(`${this.apiUrl}/test`);
  }

  // Método para obter uma categoria por ID
  getCategoryById(id: number): Observable<Category> {
    return this.client.get<Category>(`${this.apiUrl}/${id}`);
  }

  // Método para adicionar uma nova categoria
  addCategory(category: Category): Observable<Category> {
    const token = localStorage.getItem('Bearer'); // Obtém o token JWT do localStorage
    const headers = new HttpHeaders({
      Authorization: `${token}`, // Adiciona o token no cabeçalho Authorization
    });

    return this.client.post<Category>(this.apiUrl, category, { headers });
  }

  updateCategory(category: Category): Observable<Category> {
    const token = localStorage.getItem('Bearer');
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    return this.client.put<Category>(
      `${this.apiUrl}/${category.id}`,
      category,
      {
        headers,
      }
    );
  }

  // Método para excluir uma categoria
  deleteCategory(id: number): Observable<string> {
    const token = localStorage.getItem('Bearer'); // Obtém o token JWT do localStorage
    const headers = new HttpHeaders({
      Authorization: `${token}`, // Adiciona o token no cabeçalho Authorization
    });
    return this.client.delete<string>(`${this.apiUrl}/${id}`, { headers });
  }
}
