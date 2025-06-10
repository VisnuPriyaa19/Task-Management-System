import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule,RouterModule, MatInputModule, MatButtonModule, MatCardModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  uname = '';
  email = '';
  password = '';
  msg = '';

  otp = '';
  otpVerified = false;
  disableRegister = true;
  otpMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  register()
  {
    const user = { uname: this.uname, email: this.email, password: this.password };
    this.auth.register(user).subscribe({
      next: res => 
      {
        this.msg = res.msg;
        this.router.navigate(['/login']);
      },
      error: err => {
        this.msg = err.error.msg || 'Registration failed';
      }
    });
  }

  sendOTP() {
  this.auth.sendOTP(this.email).subscribe({
    next: res => this.otpMsg = 'OTP sent successfully!',
    error: err => this.otpMsg = 'Failed to send OTP'
  });
}

verifyOtp() {
  this.auth.verifyOTP(this.email, this.otp).subscribe({
    next: res => {
      this.otpVerified = true;
      this.otpMsg = 'OTP verified successfully';
      this.disableRegister = false;
    },
    error: err => {
      this.otpVerified = false;
      this.otpMsg = 'Invalid or expired OTP';
    }
  });
}

}