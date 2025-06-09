import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api/tasks';
  private projectUrl = 'http://localhost:5000/api/projects';


  // ✅ Get all tasks for a specific project
  getTasksByProject(projectId: string) {
    return this.http.get<any[]>(`${this.baseUrl}?projectId=${projectId}`);
  }

  // ✅ Create a new task
  addTask(task: any) {
    return this.http.post(this.baseUrl, task);
  }

  
  // ✅ Update a task
  updateTask(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // ✅ Delete a task
  deleteTask(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }


  createTask(taskData: any) {
    return this.http.post<any>(this.baseUrl, taskData);
  }
  getProjectById(projectId: string) {
return this.http.get<any>(`${this.projectUrl}/${projectId}`);
}
}
