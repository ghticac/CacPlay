import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private apiUrl = `${environment.apiUrl}/contenidos/`;

  constructor(private http: HttpClient) {}

  getContenido() {
    return this.http.get(this.apiUrl);
  }
}
