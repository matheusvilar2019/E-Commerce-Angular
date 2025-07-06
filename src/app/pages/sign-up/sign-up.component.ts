import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { empty } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ViaCepService } from 'src/app/services/via-cep.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  returnUrl: string = '/';
  emailAlreadyExists: boolean = false;
  formError = false;
  signupError = false;
  senha = '';
  confirmaSenha = '';
  senhasIguais = true;
  address = {    
    street: '',
    number: '',
    addressLine2: '',
    city: '',
    state: '',
    district: '',
  };

  constructor(private viaCepService: ViaCepService, private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
  }

  submit(form: any) {
    if (this.validForm(form)) this.createAccount(form);
  }

  createAccount(form: any) {    
    var accountData = {
      name: form.value.nome,
      email: form.value.email,
      password: form.value.senha,
      cpf: form.value.cpf,
      birthDate: form.value.birthDate,
      address: {
        ZipCode: form.value.zipCode,
        Street: form.value["street-address"],
        Number: form.value.number,
        AddressLine2: form.value.addressLine2,
        District: form.value.district,
        State: form.value.state,
        City: form.value.city
      }
    }

    this.authService.createAccount(accountData).subscribe(
      (data) => {
        console.log("Usuário criado com sucesso");
      },
      (error) => {
        console.error("Ocorreu um erro ao criar a conta", error);
      }
    );
  }  

  signIn(accountData: any) {
    this.authService.login({email: accountData.email, password: accountData.password}).subscribe(
      (data) => {
        console.log('Token:', data.data);
        localStorage.setItem('token', data.data);
        this.router.navigateByUrl(this.returnUrl);
      },
      (error) => {
        console.error("Ocorreu um erro ao logar", error);
      }
    );
  }

  zipCodeData(cep: any) {
    this.viaCepService.getAdress(String(cep)).subscribe(
      (data) => {
        this.address.street = data.logradouro
        this.address.district = data.bairro;
        this.address.city = data.localidade;
        this.address.state = data.estado;
      },
      (error) => {
        console.error('Erro ao obter dados sobre o endereço', error);
      }
    )
  }

  validForm(form: any): boolean {
    if (form.valid && this.senhasIguais && !this.emailAlreadyExists) {
      this.formError = false;
      return true;
    } else {
      console.log("Form inválido")
      console.log('form valid: ' + form.valid);
      console.log(form);
      this.formError = true;
      return false;
    }
  }

  validPassword() {
    if (this.senha == '' || this.confirmaSenha == '') return;

    if (this.senha === this.confirmaSenha) {
      this.senhasIguais = true;
    }
    else {
      this.senhasIguais = false;
    }
  }

  emailExists(email: string) {
    this.authService.emailExists(email).subscribe(
      (data) => {
        this.emailAlreadyExists = Boolean(data);
      },
      (error) => {
        console.error(error);
      }
    )
  }
}
