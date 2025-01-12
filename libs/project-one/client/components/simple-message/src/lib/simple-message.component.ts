import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleMessage } from './models/simple-message';

@Component({
  selector: 'lib-simple-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simple-message.component.html',
  styleUrl: './simple-message.component.css',
})
export class SimpleMessageComponent {
  @Input() input = new SimpleMessage();
}
