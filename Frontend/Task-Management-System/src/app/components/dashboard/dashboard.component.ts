import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth/auth.service';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  projects: any[] = [];
  searchTerm: string = '';
  userId: string = '';
  username: string = '';
  isProfileMenuOpen: boolean = false;
  isExpanded: { [key: string]: boolean } = {};


  constructor(
    private projectService: ProjectService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    console.log(user);
    
    if (user?.id) {
      this.userId = user.id;
      this.username = user.name|| 'User';
      this.fetchProjects();
    } else {
      console.warn('No logged in user.');
      this.router.navigate(['/']); // Redirect to login
    }
  }

  fetchProjects(): void {
    this.projectService.getProjectsByUser(this.userId).subscribe({
      next: (res) => (this.projects = res),
      error: (err) => console.error('Error fetching projects:', err)
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newProject = {
          ...result,
          userId: this.userId
        };
        this.projectService.createProject(newProject).subscribe(() => {
          this.fetchProjects();
        });
      }
    });
  }

  editProject(project: any): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '400px',
      data: { project }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.projectService.updateProject(project._id, result).subscribe(() => {
          this.fetchProjects();
        });
      }
    });
  }

  onDelete(projectId: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId).subscribe(() => {
        this.fetchProjects();
      });
    }
  }

  getFilteredProjects(): any[] {
    if (!this.searchTerm) return this.projects;
    return this.projects.filter((project) =>
      project.projectName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getDueDateClass(dueDateStr: string): string {
    const today = new Date();
    const dueDate = new Date(dueDateStr);
    const diffInDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) return 'due-overdue';
    else if (diffInDays <= 3) return 'due-soon';
    else return 'due-later';
  }

  onView(projectId: string): void {
    console.log(`Navigating to Kanban for project ID: ${projectId}`);
    this.router.navigate(['/projects', projectId]);
  }

  toggleProfileMenu(event: Event): void {
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  toggleReadMore(projectId: string): void {
     this.isExpanded[projectId] = !this.isExpanded[projectId];
  }

  @HostListener('document:click', ['$event'])
  closeProfileMenu(event: Event): void {
    if (!(event.target as HTMLElement)?.closest('.profile-container')) {
      this.isProfileMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // back to login
  }
}
