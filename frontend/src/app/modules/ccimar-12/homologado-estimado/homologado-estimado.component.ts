import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-homologado-estimado',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './homologado-estimado.component.html',
  styleUrl: './homologado-estimado.component.scss'
})
export class HomologadoEstimadoComponent {
}
