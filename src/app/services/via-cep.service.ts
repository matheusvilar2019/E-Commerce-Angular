import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {

  private apiUrl = "https://viacep.com.br/ws"

  constructor(private http: HttpClient) { }

  getAdress(cep: string): Observable<any> {
    return this.http.get(this.apiUrl + '/' + cep + '/json/');
  }
}
