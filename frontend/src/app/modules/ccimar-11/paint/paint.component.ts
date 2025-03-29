import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-paint',
  standalone: true,
  imports: [CommonModule, RouterModule],  // 🔹 Importando RouterModule
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.scss']
})
export class PaintComponent {}
