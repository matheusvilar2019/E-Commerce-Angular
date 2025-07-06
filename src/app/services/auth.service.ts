import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  data: string;
}

interface CreateAccountRequest {
  name: string,
  email: string,
  password: string,
  cpf: string,
  birthDate: Date,
  address: {
    ZipCode: number,
    Street: string,
    Number: string,
    AddressLine2: string,
    District: string,
    State: string,
    City: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'https://localhost:7239/v1/accounts';

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl + '/login', credentials);
  }

  createAccount(userData: CreateAccountRequest): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }

  emailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>('https://localhost:7239/v1/emailExists/' + email);
  }
}
