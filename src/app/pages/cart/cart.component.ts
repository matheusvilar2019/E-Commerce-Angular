import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { empty } from 'rxjs';
import { CartService, Items } from 'src/app/services/cart.service';

export interface JwtPayload {
  unique_name: string;
  exp: number;
  nbf: number;
  iat: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: any[] = [];
  subTotal: number = 0;
  shippingEstimate: number = 0;
  taxEstimate: number = 0;
  orderTotal: number = 0;

  constructor(private cookieService: CookieService, private cartService: CartService, private router: Router) { }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    if (this.getToken()) {
      this.getByAPI(this.getUserId());
    }
    else {
      this.cartItems = this.getCookie() ? JSON.parse(this.getCookie()) : [];
      this.loadPrices();
    }
  }

  getByAPI(userId: string | null) {
    this.cartService.getCartItems(userId).subscribe(
      (data) => {
        this.cartItems = data.data.items;
        if (this.addCookieItems()) this.postAllItems();
        this.loadPrices();
      }, (error) => {
        console.error("Ocorreu um erro ao buscar os items", error);
      }
    );
  }

  addCookieItems(): boolean {
    var cookieItems = this.getCookie() ? JSON.parse(this.getCookie()) : null;
    if (cookieItems) {
      cookieItems.forEach((ck: { quantity: number; product: any }) => {
        var notInCart: boolean = true;
        // Sum quantity to existing product
        this.cartItems.forEach((ct: { quantity: number; product: any }) => {
          if (ck.product.id == ct.product.id) {
            ct.quantity += ck.quantity;
            notInCart = false;
          }
        });
        // Push new product
        if (notInCart) this.cartItems.push(ck);
      });
    }
    return cookieItems ? true : false;
  }

  postAllItems() {
    var items: Items[] = this.cartItems.map(prod => ({
      productId: prod.product.id,
      quantity: prod.quantity
    }));
    this.cartService.postCartItems(this.getUserId(), items).subscribe(
      () => {
        this.deleteCookie();
      },
      (error) => {
        console.error("Ocorreu um problema ao atualizar os itens", error)
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

  getCookie(): any {
    return this.cookieService.get('cart');
  }

  deleteCookie() {
    this.cookieService.delete('cart');
  }

  submit() {
    if (this.getToken()) {
      // implement
      console.log("Checkout done!");
    }
    else {
      this.router.navigate(['/login'])
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  loadPrices() {
    this.subTotal = 0;
    this.cartItems.forEach((x: { product: any; price: number; quantity: number; }) => {
      this.subTotal = this.subTotal + (x.product.price * x.quantity)
    });

    this.taxEstimate = this.subTotal * 0.10;
    this.shippingEstimate = this.subTotal * 0.02;
    this.orderTotal = this.subTotal + this.taxEstimate + this.shippingEstimate;
  }

  removeItem(id: number) {
    this.cartItems = this.cartItems.filter((p: { product: any; id: number; }) => p.id !== id);
    this.loadPrices();
    
    if (this.getToken()) {
      this.deleteItem(id);
    } else {
      this.updateCookie();
    }
  }

  deleteItem(itemId: number) {
    this.cartService.deleteCartItem(itemId, Number(this.getUserId())).subscribe();
  }

  updateQuantity(id: number, event: Event) {
    this.cartItems.forEach((x: { product: any; id: number; quantity: number; }) => {
      if (x.product.id == id) {
        x.quantity = Number((event.target as HTMLSelectElement).value);
      }
    });

    this.loadPrices();
    
    if (this.getToken()) {
      this.postAllItems();
    } else {
      this.updateCookie();
    }
  }

  updateCookie() {
    this.cookieService.set('cart', JSON.stringify(this.cartItems), {
      expires: 7, // dias
      path: '/',
      sameSite: 'Lax'
    });
  }
}
