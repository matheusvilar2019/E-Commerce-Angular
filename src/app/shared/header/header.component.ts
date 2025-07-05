import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from 'src/app/services/cart.service';

export interface JwtPayload {
  unique_name: string;
  exp: number;
  nbf: number;
  iat: number;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  cartItems: any[] = [];
  cartItemsLength: number = 0;

  constructor(private cookieService: CookieService, private cartService: CartService) {}  

  ngOnInit() {
    this.loadCart();    
  }

  loadCart() {
    if (this.getToken()) {
      this.getByAPI(this.getUserId());
    }
    else {
      this.cartItemsLength = this.getCookie() ? JSON.parse(this.getCookie()).length : 0;
    }
  }

  getByAPI(userId: string | null) {
    this.cartService.getCartItems(userId).subscribe(
      (data) => {
        this.cartItems = data.data.items;
        this.cartItemsLength = data.data.items.length;
      }, (error) => {
        console.log("Ocorreu um erro ao buscar os items", error);
      }
    );
  }
  
  getUserId(): string | null {
      var token: string | null = this.getToken();
      if (!token) return null;
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.unique_name;
      } catch (err) {
        console.error('Erro ao decodificar o token JWT', err);
        return null;
      }
    }

  getToken(): string | null {
    return localStorage.getItem('token');
  }  

  getCookie(): any {
    return this.cookieService.get('cart');
  }
}
