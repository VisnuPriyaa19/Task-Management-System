import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { KanbanBoardComponent } from './components/kanban-board/kanban-board.component';
import { FrontPageComponent } from './components/front-page/front-page.component';
//import { KanbanComponent } from './components/kanban/kanban.component';

export const routes: Routes = [
  { path: '', component: FrontPageComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'projects/:id', component: KanbanBoardComponent }
  //{ path: 'kanban/:projectId', component: KanbanComponent }
];
