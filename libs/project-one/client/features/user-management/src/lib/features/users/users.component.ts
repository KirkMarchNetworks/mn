import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lib-users',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
}
