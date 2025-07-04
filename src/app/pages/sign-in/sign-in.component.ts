import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  loginData = {
    email: '',
    password: ''
  };

  formError = false;
  passwordError = false;
  returnUrl: string = '/';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
  }

  submit(form: any) {
    if (!this.validForm(form)) return;
    this.signIn();
  }

  signIn() {
    this.authService.login(this.loginData).subscribe(
      (data) => {
        localStorage.setItem('token', data.data);
        this.passwordError = false;
        this.router.navigateByUrl(this.returnUrl);
      },
      (error) => {
        console.error("Ocorreu um erro ao logar", error);
        if (error.status == '401') this.passwordError = true;
      }
    );
  }

  validForm(form: any): boolean {
    if (form.valid) {
      this.formError = false;
      return true;
    } else {
      console.log("Form inválido")
      this.formError = true;
      return false;
    }    
  }

}
