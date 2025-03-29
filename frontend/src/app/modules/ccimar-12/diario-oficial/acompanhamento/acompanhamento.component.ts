import { Component, OnInit, Inject, Pipe, PipeTransform } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DiarioOficialService, DiarioOficial } from '../../../../services/diario-oficial.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Pipe to convert newlines to HTML breaks
@Pipe({
  name: 'nl2br',
  standalone: true
})
export class Nl2BrPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) {
      return '';
    }
    // Replace each newline with two <br> tags for better spacing
    const replaced = value.replace(/\n/g, '<br><br>');
    return this.sanitizer.bypassSecurityTrustHtml(replaced);
  }
}

interface MonthOption {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-acompanhamento',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './acompanhamento.component.html',
  styleUrls: ['./acompanhamento.component.scss']
})
export class AcompanhamentoComponent implements OnInit {
  displayedColumns: string[] = ['data_publicacao', 'tipo', 'orgao', 'identifica', 'acoes'];
  dataSource: DiarioOficial[] = [];
  filterForm: FormGroup;
  
  availableYears: number[] = [];
  monthOptions: MonthOption[] = [
    { value: 1, viewValue: 'Janeiro' },
    { value: 2, viewValue: 'Fevereiro' },
    { value: 3, viewValue: 'Março' },
    { value: 4, viewValue: 'Abril' },
    { value: 5, viewValue: 'Maio' },
    { value: 6, viewValue: 'Junho' },
    { value: 7, viewValue: 'Julho' },
    { value: 8, viewValue: 'Agosto' },
    { value: 9, viewValue: 'Setembro' },
    { value: 10, viewValue: 'Outubro' },
    { value: 11, viewValue: 'Novembro' },
    { value: 12, viewValue: 'Dezembro' }
  ];

  tiposDocumento: string[] = [
    'Extrato de Termo Aditivo',
    'Extrato de Credenciamento',
    'Aviso',
    'Resultado de Julgamento',
    'Retificação',
    'Extrato de Contrato',
    'Extrato de Apostilamento',
    'Extrato de Inexigibilidade de Licitação',
    'Aviso de Suspensão',
    'Extrato de Adiamento',
    'Extrato de Ata',
    'Extrato de Registro de Preços',
    'Aviso de Licitação-Pregão',
  ].sort();

  constructor(
    private diarioService: DiarioOficialService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      ano: [''],
      mes: [''],
      tipo: ['']
    });
  }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    this.availableYears = Array.from(
      { length: currentYear - 2023 },
      (_, i) => 2024 + i
    );

    this.filterForm.patchValue({
      ano: currentYear,
      mes: currentMonth,
      tipo: ''
    });

    this.loadDiarios();

    this.filterForm.valueChanges.subscribe(() => {
      this.loadDiarios();
    });
  }

  loadDiarios() {
    const { ano, mes, tipo } = this.filterForm.value;
    if (ano && mes) {
      this.diarioService.getDiariosByMesAno(ano, mes).subscribe({
        next: (data) => {
          this.dataSource = tipo 
            ? data.filter(d => d.tipo === tipo)
            : data;
        },
        error: (error) => {
          console.error('Erro ao carregar diários:', error);
        }
      });
    }
  }

  openPdf(url: string) {
    window.open(url, '_blank');
  }

  openDetailDialog(diario: DiarioOficial) {
    this.dialog.open(DiarioDetailDialogComponent, {
      data: diario,
      panelClass: 'diario-dialog',
      width: '800px'
    });
  }
}

@Component({
  selector: 'app-diario-detail-dialog',
  template: `
    <h2 mat-dialog-title>Detalhes da Publicação</h2>
    <mat-dialog-content class="dialog-content">
      <div class="dialog-section">
        <h3 class="section-title">Informações Gerais</h3>
        
        <div class="dialog-field-inline">
          <span class="field-label">Data:</span> <span class="field-value">{{data.data_publicacao | date:'dd/MM/yyyy'}}</span>
        </div>
        
        <div class="dialog-field-inline">
          <span class="field-label">Edição:</span> <span class="field-value">{{data.edicao}}</span>
        </div>
        
        <div class="dialog-field-inline">
          <span class="field-label">Tipo:</span> <span class="field-value">{{data.tipo}}</span>
        </div>
        
        <div class="dialog-field-inline">
          <span class="field-label">Órgão:</span> <span class="field-value">{{data.orgao}}</span>
        </div>
        
        <div class="dialog-field-inline">
          <span class="field-label">Identificação:</span> <span class="field-value">{{data.identifica}}</span>
        </div>
        
        <div class="dialog-field-inline">
          <span class="field-label">ID da Matéria:</span> <span class="field-value">{{data.id_materia}}</span>
        </div>
        
        <div class="dialog-field-inline" *ngIf="data.registro">
          <span class="field-label">Registro:</span> <span class="field-value">{{data.registro}}</span>
        </div>
        
        <div class="dialog-field-inline">
          <span class="field-label">Status de Auditoria:</span>
          <span class="field-value" [ngClass]="data.auditado ? 'status-success' : 'status-pending'">
            {{data.auditado ? 'Auditado' : 'Não auditado'}}
          </span>
        </div>
      </div>
      
      <div class="dialog-section" *ngIf="data.comentario">
        <h3 class="section-title">Comentário</h3>
        <div class="comentario-box">
          {{data.comentario}}
        </div>
      </div>
      
      <div class="dialog-section" *ngIf="data.texto_completo">
        <h3 class="section-title">Texto Completo</h3>
        <div class="texto-completo" [innerHTML]="data.texto_completo | nl2br"></div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fechar</button>
      <button mat-raised-button color="primary" (click)="openPdf()">
        <mat-icon>picture_as_pdf</mat-icon>
        Abrir PDF
      </button>
    </mat-dialog-actions>
  `,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    Nl2BrPipe,
    NgClass
  ]
})
export class DiarioDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DiarioDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DiarioOficial
  ) {}

  openPdf() {
    window.open(this.data.link_pdf, '_blank');
  }
} 