import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  productId: string | null = null;
  product: any = null;

  constructor(private route: ActivatedRoute, private productService: ProductService, private cookieService: CookieService, private router: Router) {
    this.productId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.productService.getProduct(this.productId).subscribe(
      (data) => {
        this.product = data.data;
        console.log(this.product);
      },
      (error) => {
        console.error('Erro ao obter dados sobre o produto', error);
      }
    );

    this.lerCarrinho();
  }

  salvarNoCarrinho() {
    const cookie = this.cookieService.get('carrinho');
    var cart = cookie ? JSON.parse(cookie) : [];
    const addProduct = {
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      description: this.product.description,
      slug: this.product.slug,
      image: this.product.image,
      quantidade: 1
    };

    if (!cart || cart.length === 0) {
      cart = [addProduct];
    }
    else {
      var addnew: Boolean = true;
      // Is this product already is in the array?
      cart.forEach((x: { id: any; quantidade: number; }) => {
        if (x.id == addProduct.id) {
          x.quantidade++;
          addnew = false;
        } 
      });
      if (addnew) cart.push(addProduct);
    }

    this.cookieService.set('carrinho', JSON.stringify(cart), {
      expires: 7, // dias
      path: '/',
      sameSite: 'Lax'
    });

    this.router.navigate(['/cart'])
  }

  lerCarrinho() {
    const cookie = this.cookieService.get('carrinho');
    const carrinho = cookie ? JSON.parse(cookie) : [];
    console.log(carrinho);
  }

  limparCarrinho() {
    this.cookieService.delete('carrinho', '/');
  }
}
