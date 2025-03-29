import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-credenciamento',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './credenciamento.component.html',
  styleUrl: './credenciamento.component.scss'
})
export class CredenciamentoComponent {

}
