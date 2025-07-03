import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from 'src/app/services/cart.service';

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

  constructor(private cookieService: CookieService, private cartService: CartService) {}

  ngOnInit(){
    this.loadCart();    
  }

  loadCart() {
    if (this.isLoggedIn()) {
      var userId = '1';
      this.cartService.getCartItems(userId).subscribe(
        (data) => {
          this.cartItems = data.data.items;
          this.loadPrices();    
        }, (error) => {
          console.log("Ocorreu um erro ao buscar os items", error);
        }
      )

    } else {
      const cookie = this.cookieService.get('carrinho');
      this.cartItems = cookie ? JSON.parse(cookie) : [];    
      console.log(this.cartItems);
    }    
  }

  isLoggedIn(): boolean {
    var hasToken: boolean = localStorage.getItem('token') ? true : false;
    return hasToken;
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

  updateQuantity(id: number, event: Event) {
    this.cartItems.forEach((x: { product: any; id: number; quantity: number; }) => {
      if(x.product.id == id) {
        x.quantity = Number((event.target as HTMLSelectElement).value);
      }
    });

    this.loadPrices();
    this.updateCookie();
  }

  removeItem(id: number) {
    this.cartItems = this.cartItems.filter((p: { id: number; }) => p.id !== id);

    this.loadPrices();
    this.updateCookie();
  }

  updateCookie() {
    this.cookieService.set('carrinho', JSON.stringify(this.cartItems), {
      expires: 7, // dias
      path: '/',
      sameSite: 'Lax'
    });
  }
}
