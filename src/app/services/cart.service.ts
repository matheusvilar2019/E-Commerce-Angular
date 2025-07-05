import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Items {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private urlApi = 'https://localhost:7239/v1/carts';

  constructor(private http: HttpClient) { }

  getCartItems(userId: string | null): Observable<any> {
    return this.http.get(this.urlApi + '/items/user/' + userId);
  }

  postCartItems(userId: string | null, items: Items[]): Observable<any> {
    return this.http.post(this.urlApi + '/items/user/' + userId, items);
  }

  deleteCartItem(itemId: number | null, userId: number | null): Observable<any> {
    return this.http.delete(this.urlApi + '/user/' + userId + '/items/' + itemId);
  }
}
