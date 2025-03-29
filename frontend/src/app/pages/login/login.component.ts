import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment'; 

interface UsuarioLogado {
  nome: string;
  nip: string;
  email: string;
  perfis: string[];
  perfil_ativo: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private http: HttpClient,
    private router: Router
  ) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.http.get<UsuarioLogado>(`${environment.apiUrl}/users/usuario/`, {
          headers: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`
          }
        }).subscribe((user) => {
          localStorage.setItem('user_data', JSON.stringify(user));
          this.userService.setUserData(user);
          this.router.navigate(['/home']);
        });        
      },
      error: () => alert('Usuário ou senha inválidos')
    });
  }

  enterWithoutLogin() {
    this.router.navigate(['/home']);
  }
}
