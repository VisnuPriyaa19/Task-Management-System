import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  uname = '';
  password = '';
  msg = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() 
  {
    const user = { uname: this.uname, password: this.password };
    this.auth.login(user).subscribe({
      next: res => {
        this.msg = res.msg;
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user)); // Save user object with ID cuz this ID is needed for creating project specific to the user
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.msg = err.error.msg || 'Login failed';
      }
    });
  }
}
