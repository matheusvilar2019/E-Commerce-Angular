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
  formError = false;
  signupError = false;
  senha = '';
  confirmaSenha = '';
  senhasIguais = true;
  endereco = {
    cidade: '',
    estado: '',
    bairro: '',
    logradouro: ''
  };

  constructor(private viaCepService: ViaCepService, private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
  }

  submit(form: any) {
    console.log(form.value)
    if (!this.validForm(form)) return;
    this.createAccount(form);
  }

  createAccount(form: any) {    
    var accountData = {
      name: form.value.nome,
      email: form.value.email,
      password: form.value.senha,
      cpf: '12312312300',
      cep: form.value.cep,
      address: form.value["street-address"]
    }

    console.log("Account Data:")
    console.log(accountData);

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

  cepData(cep: any) {
    this.viaCepService.getAdress(String(cep)).subscribe(
      (data) => {
        this.endereco.logradouro = data.logradouro
        this.endereco.bairro = data.bairro;
        this.endereco.cidade = data.localidade;
        this.endereco.estado = data.estado;
      },
      (error) => {
        console.error('Erro ao obter dados sobre o endereço', error);
      }
    )
  }

  validForm(form: any): boolean {
    if (form.valid && this.senhasIguais) {
      this.formError = false;
      return true;
    } else {
      console.log("Form inválido")
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
}
