import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TaskService } from '../../services/task.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';



@Component({
  selector: 'app-task-details-dialog',
  imports: [CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule, MatDatepickerModule,
  MatNativeDateModule],
  templateUrl: './task-details-dialog.component.html',
  styleUrl: './task-details-dialog.component.css'
})



export class TaskDetailsDialogComponent {
  dialogRef = inject(MatDialogRef<TaskDetailsDialogComponent>);
  data = inject(MAT_DIALOG_DATA) as any;
  taskService = inject(TaskService);

  editable = false;
  task = { ...this.data.task }; // deep copy to allow local editing

  enableEdit() {
    this.editable = true;
  }

  updateTask() {
    this.taskService.updateTask(this.task._id, this.task).subscribe({
      next: (res) => {
        this.dialogRef.close({ updated: true, task: res });
      },
      error: (err) => {
        console.error('Update failed:', err);
      }
    });
  }

  deleteTask() {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(this.task._id).subscribe({
        next: () => this.dialogRef.close({ deleted: true }),
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}