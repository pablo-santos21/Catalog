import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-precos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './precos.component.html',
  styleUrl: './precos.component.css',
})
export class PrecosComponent {
  isAnnual = true;
}
