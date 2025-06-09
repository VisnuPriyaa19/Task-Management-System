import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { EventEmitter, Output } from '@angular/core';

// 
@Component({
  selector: 'app-task-card',
  imports: [CommonModule, MatCardModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  @Input() task: any;

  @Output() taskClick = new EventEmitter<any>();

  handleClick() {
    this.taskClick.emit(this.task);
  }
}