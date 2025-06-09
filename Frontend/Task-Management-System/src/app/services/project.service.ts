import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = 'http://localhost:5000/api/projects';

  constructor(private http: HttpClient) {}

  // 🔹 Create a new project
  createProject(data: {
    projectName: string;
    projectDesc: string;
    dueDate: Date;
    userId: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  // 🔹 Get all projects by user
  getProjectsByUser(userId: string): Observable<any[]> {
    console.log(`Fetching projects for user ID: ${userId}`);
    return this.http.get<any[]>(`${this.baseUrl}/user/${userId}`);
  }

  // 🔹 Get single project by ID (used for view/edit)
  getProjectById(projectId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${projectId}`);
  }

  // 🔹 Update a project
  updateProject(projectId: string, data: {
    projectName: string;
    projectDesc: string;
    dueDate: Date;
  }): Observable<any> {
    return this.http.put(`${this.baseUrl}/${projectId}`, data);
  }

  // 🔹 Delete a project
  deleteProject(projectId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${projectId}`);
  }
}
