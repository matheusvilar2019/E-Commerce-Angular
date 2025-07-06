import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from 'src/app/services/cart.service';

export interface JwtPayload {
  nameid: string;
  firstName: string;
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

  constructor(private cookieService: CookieService, private cartService: CartService, private router: Router) { }

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
      return decoded.nameid;
    } catch (err) {
      console.error('Erro ao decodificar o token JWT', err);
      return null;
    }
  }

  getFirstName(): string | null {
    var token: string | null = this.getToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.firstName;
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

  loggout() {
    localStorage.removeItem('token');
  }

  login() {
    const currentUrl = this.router.url;
    this.router.navigate(["/login"], { queryParams: {returnUrl: currentUrl} });
  }

  signup() {
    const currentUrl = this.router.url;
    this.router.navigate(['/signup'], { queryParams: {returnUrl: currentUrl} });
  }
}
