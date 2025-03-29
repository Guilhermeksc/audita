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
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-pesquisar-data',
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
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './pesquisar-data.component.html',
  styleUrls: ['./pesquisar-data.component.scss']
})
export class PesquisarDataComponent {
  secoes = [
    { value: '1', viewValue: 'Seção 1' },
    { value: '2', viewValue: 'Seção 2' },
    { value: '3', viewValue: 'Seção 3' }
  ];

  pesquisar() {
    // Implementação básica para testes
    console.log('Pesquisando...');
  }
} 