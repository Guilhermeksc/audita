import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-concorrencia',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './concorrencia.component.html',
  styleUrl: './concorrencia.component.scss'
})
export class ConcorrenciaComponent {

}
