import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { ObjetoAuditavel } from '../objetos-auditaveis.service';

@Component({
  selector: 'app-detalhe-objeto-dialog',
  standalone: true,
  templateUrl: './detalhe-objeto-dialog.component.html',
  styleUrls: ['./detalhe-objeto-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDialogModule
  ]
})
export class DetalheObjetoDialogComponent {
  tiposServico = ['Avaliação', 'Auditoria'];
  origens = ['Avaliação de Riscos', 'Obrigação Legal', 'Solicitação da Gestão'];
  situacoes = ['Previsto', 'Planejamento', 'Em andamento'];

  constructor(
    public dialogRef: MatDialogRef<DetalheObjetoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ObjetoAuditavel
  ) {
    console.log('[DEBUG] Diálogo criado com dados:', data);
  }

  salvar(): void {
    console.log('[DEBUG] Salvando alterações:', this.data);
    this.dialogRef.close(this.data);
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  excluir(): void {
    const confirmacao = confirm('Tem certeza que deseja excluir este objeto?');
    if (confirmacao) {
      console.log('[DEBUG] Objeto marcado para exclusão:', this.data);
      this.dialogRef.close({ excluir: true, objeto: this.data });
    }
  }
}