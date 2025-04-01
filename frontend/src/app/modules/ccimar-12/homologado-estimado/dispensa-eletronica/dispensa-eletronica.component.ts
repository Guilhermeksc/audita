import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PNCPModelService, PNCPModel } from './dispensa-eletronica.service';
import { DetalhePNCPModelComponent } from './detalhe-dispensa-eletronica/detalhe-dispensa-eletronica.component';

@Component({
  selector: 'app-dispensa-eletronica',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    HttpClientModule,
  ],
  templateUrl: './dispensa-eletronica.component.html',
  styleUrl: './dispensa-eletronica.component.scss'
})
export class PNCPModelComponent implements OnInit {
  displayedColumns: string[] = [
     'acao', 'alerta', 'sequencialCompra', 'anoCompra', 'numeroCompra', 'processo',
    'codigoUnidade', 'nomeUnidade', 'ufSigla', 'valorTotalHomologado', 'modoDisputaNome', 'amparoLegal.nome',
  ];

  dataSource: PNCPModel[] = [];

  constructor(
    private dialog: MatDialog,
    private service: PNCPModelService,
    private http: HttpClient // <-- adicione isso
) {}
  ngOnInit(): void {
    this.service.listarObjetos().subscribe({
      next: (dados) => this.dataSource = dados,
      error: (err) => console.error('Erro ao carregar objetos auditáveis:', err)
    });
  }

  openDetailDialog(row: PNCPModel): void {
    const dialogRef = this.dialog.open(DetalhePNCPModelComponent, {
      data: { ...row }, // cópia para edição isolada
      width: '800px',
      height: '600px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
  
      if (result.excluir && result.objeto?.sequencialCompra) {
        this.service.excluirObjeto(result.objeto.sequencialCompra).subscribe({
          next: () => {
            console.log('[DEBUG] Objeto excluído:', result.objeto.sequencialCompra);
            this.dataSource = this.dataSource.filter(obj => obj.sequencialCompra !== result.objeto.sequencialCompra);
          },
          error: (err) => {
            console.error('Erro ao excluir objeto:', err);
          }
        });
      }
  
      if (!result.excluir && result.objeto) {
        const index = this.dataSource.findIndex(o => o.sequencialCompra === result.objeto.sequencialCompra);
        if (index >= 0) this.dataSource[index] = result.objeto;
        this.dataSource = [...this.dataSource]; // força atualização da tabela
      }
    });
  }

  baixarDocumento(element: PNCPModel): void {
    const ano = element.anoCompra;
    const sequencial = element.sequencialCompra;
    const baseUrl = 'https://pncp.gov.br/api/pncp/v1/orgaos/00394502000144/compras';
  
    const quantidadeUrl = `${baseUrl}/${ano}/${sequencial}/arquivos/quantidade`;
  
    this.http.get<number>(quantidadeUrl).subscribe({
      next: (quantidade) => {
        if (quantidade === 1) {
          const downloadUrl = `${baseUrl}/${ano}/${sequencial}/arquivos/1`;
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = '';
          a.click();
        } else if (quantidade === 0) {
          alert('Nenhum documento encontrado para download.');
        } else {
          alert('Foram encontradas múltiplas versões para download.');
        }
      },
      error: (err) => {
        console.error('Erro ao verificar documentos:', err);
        alert('Erro ao tentar buscar documentos para download.');
      }
    });
  }
  
  
}