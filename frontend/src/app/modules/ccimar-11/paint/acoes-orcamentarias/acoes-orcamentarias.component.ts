import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-acoes-orcamentarias',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './acoes-orcamentarias.component.html',
  styleUrl: './acoes-orcamentarias.component.scss'
})
export class AcoesOrcamentariasComponent {

}
