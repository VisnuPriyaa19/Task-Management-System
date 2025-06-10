import {
  Component,
  inject,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  DragDropModule
} from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/tasks/task.service';
import { TaskCardComponent } from '../task-card/task-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { TaskDetailsDialogComponent } from '../task-details-dialog/task-details-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    TaskCardComponent,
    MatCardModule,
    TaskDetailsDialogComponent,
    AddTaskDialogComponent,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.css'
})
export class KanbanBoardComponent implements OnInit {
  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);

  projectId!: string;
  projectTitle: string = '';

  statuses = ['backlog', 'to-do', 'in-progress', 'done'];
  dropListIds = this.statuses;

  tasks: { [key: string]: any[] } = {
    backlog: [],
    'to-do': [],
    'in-progress': [],
    done: []
  };

  allTasks: any[] = [];

  selectedPriority: string = '';
  selectedDueDate: Date | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id')!;
      this.loadProject();
      this.loadTasks();
    });
  }

  loadProject() {
    this.taskService.getProjectById(this.projectId).subscribe(project => {
      this.projectTitle = project.projectName;
    });
  }

  loadTasks() {
    this.taskService.getTasksByProject(this.projectId).subscribe(res => {
        console.log('Loaded tasks:', res);
      this.allTasks = res;
      this.applyFilters(); // apply filters on latest fetch
    });
  }

//   applyFilters() {
//     const filtered = this.allTasks.filter(task => {
//       // const matchPriority = this.selectedPriority ? task.priority === this.selectedPriority : true;
      
//       const matchPriority = this.selectedPriority
//   ? task.priority?.toLowerCase() === this.selectedPriority.toLowerCase()
//   : true;


//         const matchDueDate = this.selectedDueDate
//   ? new Date(task.dueDate).setHours(0, 0, 0, 0) === new Date(this.selectedDueDate).setHours(0, 0, 0, 0)
//   : true;

//       return matchPriority && matchDueDate;
//     });

//     this.statuses.forEach(status => {
//       this.tasks[status] = filtered.filter(task => task.status === status);
//     });

//     console.log('Applying filters:', {
//   selectedPriority: this.selectedPriority,
//   selectedDueDate: this.selectedDueDate,
//   allTasks: this.allTasks
// });

//   }



applyFilters() {
  const filtered = this.allTasks.filter(task => {
    // ✅ Match priority if selected
    const matchPriority = this.selectedPriority
      ? task.priority === this.selectedPriority
      : true;

    // ✅ Match due date if selected (task due date must be before or on selected date)
    const matchDueDate = this.selectedDueDate
      ? new Date(task.dueDate) <= new Date(this.selectedDueDate)
      : true;

    return matchPriority && matchDueDate;
  });

  // ✅ Distribute filtered tasks into respective status columns
  this.statuses.forEach(status => {
    this.tasks[status] = filtered.filter(task => task.status === status);
  });
}


  clearFilters() {
    this.selectedPriority = '';
    this.selectedDueDate = null;
    this.applyFilters();
  }

  onDrop(event: CdkDragDrop<any[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const oldStatus = task.status;

      task.status = newStatus;

      this.taskService.updateTask(task._id, task).subscribe({
        next: updatedTask => {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          this.loadTasks();
        },
        error: err => {
          console.error('Task status update failed:', err);
          task.status = oldStatus;
        }
      });
    }
  }

  openAddTaskDialog(status: string) {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      data: {
        status,
        projectId: this.projectId
      }
    });

    dialogRef.afterClosed().subscribe(taskData => {
      if (taskData) {
        const formattedData = {
          ...taskData,
          project: taskData.projectId
        };
        delete formattedData.projectId;

        this.taskService.createTask(formattedData).subscribe({
          next: newTask => {
            this.loadTasks();
          },
          error: err => {
            console.error('Failed to create task', err);
          }
        });
      }
    });
  }

  openTaskDetails(task: any) {
    const dialogRef = this.dialog.open(TaskDetailsDialogComponent, {
      data: { task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.updated || result?.deleted) {
        this.loadTasks();
      }
    });
  }
}
