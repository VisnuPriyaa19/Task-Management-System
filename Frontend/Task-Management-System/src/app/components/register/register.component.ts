import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  uname = '';
  email = '';
  password = '';
  msg = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    const user = { uname: this.uname, email: this.email, password: this.password };
    this.auth.register(user).subscribe({
      next: res => {
        this.msg = res.msg;
        this.router.navigate(['/login']);
      },
      error: err => {
        this.msg = err.error.msg || 'Registration failed';
      }
    });
  }
}
