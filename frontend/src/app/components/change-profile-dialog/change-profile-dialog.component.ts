import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-change-profile-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './change-profile-dialog.component.html',
  styleUrls: ['./change-profile-dialog.component.scss']
})

export class ChangeProfileDialogComponent implements OnInit {
  perfis: string[] = [];
  perfilSelecionado: string = '';

  constructor(
    private dialogRef: MatDialogRef<ChangeProfileDialogComponent>,
    private userService: UserService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.perfis = this.userService.getPerfis();
    this.perfilSelecionado = this.userService.getPerfilAtivo();
  }

  confirmar() {
    this.http.post(`${environment.apiUrl}/users/trocar-perfil/`, {
      perfil: this.perfilSelecionado
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    }).subscribe({
      next: () => {
        this.userService.setPerfilAtivo(this.perfilSelecionado);
        this.dialogRef.close(this.perfilSelecionado);
      },
      error: () => {
        alert('Erro ao trocar de perfil.');
      }
    });
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}