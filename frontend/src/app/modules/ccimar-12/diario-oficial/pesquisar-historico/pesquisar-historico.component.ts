import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pesquisar-historico',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './pesquisar-historico.component.html',
  styleUrls: ['./pesquisar-historico.component.scss']
})
export class PesquisarHistoricoComponent {
  secoes = [
    { value: '1', viewValue: 'Seção 1' },
    { value: '2', viewValue: 'Seção 2' },
    { value: '3', viewValue: 'Seção 3' }
  ];

  pesquisar() {
    // Implementar lógica de pesquisa
    console.log('Pesquisando...');
  }
} 