import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = false;
  private apiUrl = 'http://localhost:4200/users';
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<any[]>('api/users').pipe(
      map((users) => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          this.isLoggedIn = true;
          return true;
        } else {
          return false;
        }
      })
    );
  }

  register(email: string, password: string): Observable<boolean> {
    const newUser = { email, password };
    return this.http.post('api/users', newUser).pipe(map(() => true));
  }

  logout(): void {
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
  // Update user's email
  updateUser(id: number, email: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { email });
  }

  // Update user's email and password
  updateUserWithPassword(
    id: number,
    email: string,
    password: string,
    newPassword: string
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, {
      email,
      password,
      newPassword,
    });
  }

  verifyPassword(userId: number, currentPassword: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/users/verifyPassword`, {
      userId,
      currentPassword,
    });
  }
}
