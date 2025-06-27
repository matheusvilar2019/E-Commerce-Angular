import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private productService: ProductService) {
    this.productId = this.route.snapshot.paramMap.get('id');    
  }

  ngOnInit(){
    this.productService.getProduct(this.productId).subscribe(
      (data) => {
        this.product = data.data;
        console.log(this.product);
      },
      (error) => {
        console.error('Erro ao obter dados sobre o produto', error);
      }
    );
  }
}
