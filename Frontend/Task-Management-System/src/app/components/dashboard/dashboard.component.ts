import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  username = ''; // retrieved from storage or service
  userId = '';
  projects: any[] = [];
  filteredProjects: any[] = [];
  searchTerm = '';
  showCreateForm = false;
  newProject = {
    name: '',
    description: '',
    type: 'individual',
    teamSize: 0
  };
  teamEmails: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    this.username = userData.uname;
    this.userId = userData.id; //  This matches what backend sent
    this.fetchProjects();
  }

  fetchProjects() {
    this.http.get<any[]>(`http://localhost:5000/api/projects/${this.userId}`)
      .subscribe(projects => {
        this.projects = projects;
        this.filteredProjects = projects;
      });
  }

  toggleCreate() {
    this.showCreateForm = !this.showCreateForm;
  }

  sendInvites() {
    console.log('Inviting:', this.teamEmails);
    // Call email service (optional for now, can be implemented later)
  }

  createProject() {
    const payload = {
      ...this.newProject,
      teamMembers: this.teamEmails,
      owner: this.userId
    };
    this.http.post('http://localhost:5000/api/projects/create', payload)
      .subscribe(() => {
        alert('Project created!');
        this.fetchProjects();
        this.showCreateForm = false;
        this.newProject = { name: '', description: '', type: 'individual', teamSize: 0 };
        this.teamEmails = [];
      });
  }
}
