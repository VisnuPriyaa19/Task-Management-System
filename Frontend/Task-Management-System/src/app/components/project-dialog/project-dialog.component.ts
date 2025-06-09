import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-project-dialog',
  standalone:true,
  imports: [MatDatepicker,MatInputModule,MatDatepickerModule,
            MatNativeDateModule,ReactiveFormsModule,MatFormFieldModule,
            MatInputModule,MatButtonModule,MatDialogModule],
  templateUrl: './project-dialog.component.html',
  styleUrl: './project-dialog.component.css'
})
export class ProjectDialogComponent {
  projectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.projectForm = this.fb.group({
      projectName: [data?.project?.projectName || '', Validators.required],
      projectDesc: [data?.project?.projectDesc || '', Validators.required],
      dueDate: [data?.project?.dueDate || '', Validators.required],
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.dialogRef.close(this.projectForm.value);
    }
  }
}
