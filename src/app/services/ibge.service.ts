import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IbgeService {
  private apiBaseUrl = 'http://localhost:8080/api'; // 🔹 Apontando para o backend

  constructor(private http: HttpClient) {}

  // 🔹 Buscar UFs pelo backend
  getUfs(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiBaseUrl}/ufs`);
  }

  // 🔹 Buscar municípios pelo backend
  getMunicipios(uf: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiBaseUrl}/municipios/${uf}`);
  }
}
