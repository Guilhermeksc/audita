import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-objetivos-navais',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './objetivos-navais.component.html',
  styleUrl: './objetivos-navais.component.scss'
})
export class ObjetivosNavaisComponent {

}
