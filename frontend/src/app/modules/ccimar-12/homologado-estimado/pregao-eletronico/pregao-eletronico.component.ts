import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-pregao-eletronico',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './pregao-eletronico.component.html',
  styleUrl: './pregao-eletronico.component.scss'
})
export class PregaoEletronicoComponent {

}
