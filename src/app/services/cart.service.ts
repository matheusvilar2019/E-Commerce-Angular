import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private urlApi = 'https://localhost:7239/v1/carts';

  constructor(private http: HttpClient) { }

  getCartItems(userId: string | null): Observable<any> {
    return this.http.get(this.urlApi + "/user/" + userId);
  }
}
