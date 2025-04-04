import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RiscosService, RiscosResponse, Risco } from './riscos.service';

@Component({
  selector: 'app-riscos',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule, MatIconModule, MatTableModule],
  templateUrl: './riscos.component.html',
  styleUrls: ['./riscos.component.scss']
})
export class RiscosComponent implements OnInit {
  displayedColumns: string[] = ['codigo', 'risco', 'descricao'];
  licitacao: Risco[] = [];
  execucao: Risco[] = [];
  recursos_humanos: Risco[] = [];
  patrimonio: Risco[] = [];
  municiamento: Risco[] = [];

  constructor(private riscosService: RiscosService) {}

  ngOnInit(): void {
    this.riscosService.getRiscos().subscribe((response: RiscosResponse) => {
      this.licitacao = response.licitacao;
      this.execucao = response.execucao;
      this.recursos_humanos = response.recursos_humanos;
      this.patrimonio = response.patrimonio;
      this.municiamento = response.municiamento;
    });
  }
}
