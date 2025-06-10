import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

type RegisterResponse = {
  msg : string;
}

type LoginResponse = {
  msg: string;
  token: string;
  user: {
    uname: string;
    email: string;
    id: string;
  };
}

type OTPSendResponse = {
  msg: string;
}

type OTPVerifyResponse = {
  msg : string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  register(userData:  {
  uname: string;
  email: string;
  password: string;}): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData);
  }

  login(userData: {
  uname: string;
  password: string;}): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, userData);
  }

  sendOTP(email: string): Observable<OTPSendResponse> {
    const payload : {email:string} = {email};
    return this.http.post<OTPSendResponse>(`${this.apiUrl}/send-otp`, payload);
  }

  verifyOTP(email: string, otp: string): Observable<OTPVerifyResponse> {
    const payload : {email:string, otp:string} = {email,otp};
    return this.http.post<OTPVerifyResponse>(`${this.apiUrl}/verify-otp`, payload);
  }

  getCurrentUser(): {id:string, name:string, email:string}|null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log(payload);
      
      return {
        id: payload.userId || payload.id,
        email: payload.email,
        name: payload.uname || payload.username || payload.name || 'User'  
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  return null;
}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
