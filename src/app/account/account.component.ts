import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  accountForm: FormGroup;
  user: any;
  editMode = false;
  incorrectPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      newPassword: ['', Validators.minLength(6)],
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.accountForm.patchValue({
        email: this.user.email,
      });
    }
  }

  toggleEditMode(): void {
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.incorrectPassword = false;
    this.loadUserData();
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      const { email, password, newPassword } = this.accountForm.value;

      this.authService.verifyPassword(this.user.id, password).subscribe(
        (isPasswordCorrect) => {
          if (isPasswordCorrect) {
            if (newPassword) {
              this.authService
                .updateUserWithPassword(
                  this.user.id,
                  email,
                  password,
                  newPassword
                )
                .subscribe(() => {
                  alert('Account updated successfully');
                  this.user.email = email;
                  localStorage.setItem('user', JSON.stringify(this.user));
                  this.editMode = false;
                  this.incorrectPassword = false;
                });
            } else {
              this.authService.updateUser(this.user.id, email).subscribe(() => {
                alert('Account updated successfully');
                this.user.email = email;
                localStorage.setItem('user', JSON.stringify(this.user));
                this.editMode = false;
                this.incorrectPassword = false;
              });
            }
          } else {
            this.incorrectPassword = true;
          }
        },
        (error) => {
          console.error('Error verifying password:', error);
        }
      );
    }
  }

  logout(): void {
    this.authService.logout();
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
