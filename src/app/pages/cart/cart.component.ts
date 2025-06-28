import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartProducts: any = [];
  subTotal: number = 0;
  shippingEstimate: number = 0;
  taxEstimate: number = 0;
  orderTotal: number = 0;

  constructor(private cookieService: CookieService) {}

  ngOnInit(){
    this.loadCart();
    this.loadPrices();    
  }

  loadCart() {
    const cookie = this.cookieService.get('carrinho');
    this.cartProducts = cookie ? JSON.parse(cookie) : [];    
    console.log(this.cartProducts);
  }

  loadPrices() {
    this.subTotal = 0;

    this.cartProducts.forEach((x: { price: number; quantidade: number; }) => {
      this.subTotal = this.subTotal + (x.price * x.quantidade)
    });
    
    this.taxEstimate = this.subTotal * 0.10;
    this.shippingEstimate = this.subTotal * 0.02;
    this.orderTotal = this.subTotal + this.taxEstimate + this.shippingEstimate;
  }

  updateAmount(id: number, event: Event) {
    this.cartProducts.forEach((x: { id: number; quantidade: number; }) => {
      if(x.id == id) {
        x.quantidade = Number((event.target as HTMLSelectElement).value);
      }
    });

    this.loadPrices();
    this.updateCookie();
  }

  removeProduct(id: number) {
    this.cartProducts = this.cartProducts.filter((p: { id: number; }) => p.id !== id);

    this.loadPrices();
    this.updateCookie();
  }

  updateCookie() {
    this.cookieService.set('carrinho', JSON.stringify(this.cartProducts), {
      expires: 7, // dias
      path: '/',
      sameSite: 'Lax'
    });
  }
}
