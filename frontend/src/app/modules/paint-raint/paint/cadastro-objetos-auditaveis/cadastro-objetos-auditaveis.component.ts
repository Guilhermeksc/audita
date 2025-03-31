import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ObjetosAuditaveisService, ObjetoAuditavel } from './objetos-auditaveis.service';
import { DetalheObjetoDialogComponent } from './detalhe-objeto-dialog/detalhe-objeto-dialog.component';

@Component({
  selector: 'app-cadastro-objetos-auditaveis',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    HttpClientModule,
  ],
  templateUrl: './cadastro-objetos-auditaveis.component.html',
  styleUrls: ['./cadastro-objetos-auditaveis.component.scss']
})
export class CadastroObjetosAuditaveisComponent implements OnInit {
  displayedColumns: string[] = [
    'nr', 'tipo_de_servico', 'descricao', 'origem_demanda',
    'inicio', 'conclusao', 'hh', 'situacao'
  ];

  dataSource: ObjetoAuditavel[] = [];

  constructor(
    private dialog: MatDialog,
    private service: ObjetosAuditaveisService
  ) {}

  ngOnInit(): void {
    this.service.listarObjetos().subscribe({
      next: (dados) => this.dataSource = dados,
      error: (err) => console.error('Erro ao carregar objetos auditáveis:', err)
    });
  }

  openDetailDialog(row: ObjetoAuditavel): void {
    const dialogRef = this.dialog.open(DetalheObjetoDialogComponent, {
      data: { ...row }, // cópia para edição isolada
      width: '800px',
      height: '600px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
  
      if (result.excluir && result.objeto?.nr) {
        this.service.excluirObjeto(result.objeto.nr).subscribe({
          next: () => {
            console.log('[DEBUG] Objeto excluído:', result.objeto.nr);
            this.dataSource = this.dataSource.filter(obj => obj.nr !== result.objeto.nr);
          },
          error: (err) => {
            console.error('Erro ao excluir objeto:', err);
          }
        });
      }
  
      if (!result.excluir && result.objeto) {
        const index = this.dataSource.findIndex(o => o.nr === result.objeto.nr);
        if (index >= 0) this.dataSource[index] = result.objeto;
        this.dataSource = [...this.dataSource]; // força atualização da tabela
      }
    });
  }
  
}
