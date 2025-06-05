import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  uname = '';
  password = '';
  msg = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    const user = { uname: this.uname, password: this.password };
    this.auth.login(user).subscribe({
      next: res => {
        this.msg = res.msg;
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user)); // Save user object with ID
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.msg = err.error.msg || 'Login failed';
      }
    });
  }
}
