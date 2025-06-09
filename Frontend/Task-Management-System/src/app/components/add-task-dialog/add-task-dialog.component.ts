import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';



@Component({
  selector: 'app-add-task-dialog',
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatDialogModule,MatSelectModule,MatDatepickerModule,
  MatNativeDateModule],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.css'
})
export class AddTaskDialogComponent {
  dialogRef = inject(MatDialogRef<AddTaskDialogComponent>);
  data = inject(MAT_DIALOG_DATA) as { status: string, projectId: string };
task = {
  taskName: '',
  taskDesc: '',
  dueDate: '',
  status: this.data.status,
  projectId: this.data.projectId,
  priority: 'medium'
};


  addTask() {
    console.log('Task to be added:', this.task);
    this.dialogRef.close(this.task);
  }

  cancel() {
    this.dialogRef.close();
  }
}
