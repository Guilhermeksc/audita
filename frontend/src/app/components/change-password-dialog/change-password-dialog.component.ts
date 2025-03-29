import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent {
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private http: HttpClient
  ) {}

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }
  
    this.http.post(`${environment.apiUrl}/users/change-password/`, {
      old_password: this.oldPassword,
      new_password: this.newPassword
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    }).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.errorMessage = 'Senha atual incorreta.'
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
