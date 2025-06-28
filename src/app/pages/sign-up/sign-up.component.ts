import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ViaCepService } from 'src/app/services/via-cep.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  formEnviado = false;
  senha = '';
  confirmaSenha = '';
  senhasIguais = false;
  endereco = {
    cidade: '',
    estado: '',
    bairro: '',
    logradouro: ''
  };

  constructor(private viaCepService: ViaCepService) {}

  enviar(form: any){
    this.formEnviado = true;

    console.log(this.senha)

    if(form.valid && this.senhaValida()) {
      console.log('Formulario OK');
      this.formEnviado = false;
    } 
    else {
      console.log('Formulário inválido');
    }
  }

  consultaCep(cep: any) {
    this.viaCepService.getAdress(String(cep)).subscribe(
      (data) => {
        console.log(data);
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

  senhaValida() {
    if (this.senha === this.confirmaSenha) {
      return this.senhasIguais = true;
    } 
    else {
      return this.senhasIguais = false;
    }
  }
}
