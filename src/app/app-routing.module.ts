import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './pages/product/product.component';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { SuccessComponent } from './pages/success/success.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'product/:id', component: ProductComponent},
  {path: 'cart', component: CartComponent},
  {path: 'login', component: SignInComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'success', component: SuccessComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
