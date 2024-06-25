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
  user: any; // Define user object structure as per your application
  editMode = false;
  incorrectPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]], // Password field is optional
      newPassword: ['', Validators.minLength(6)], // New password field for updating password
      // Add more fields here as per your application's user data structure
    });
  }

  ngOnInit(): void {
    this.loadUserData(); // Load user data when component initializes
  }

  loadUserData(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.accountForm.patchValue({
        email: this.user.email,
        // Patch other form fields here
      });
    }
  }

  toggleEditMode(): void {
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.incorrectPassword = false; // Reset incorrect password flag
    this.loadUserData(); // Reload user data to discard changes
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      const { email, password, newPassword } = this.accountForm.value;

      // Check current password before updating
      this.authService.verifyPassword(this.user.id, password).subscribe(
        (isPasswordCorrect) => {
          if (isPasswordCorrect) {
            if (newPassword) {
              // Update both email and password
              this.authService
                .updateUserWithPassword(
                  this.user.id,
                  email,
                  password,
                  newPassword
                )
                .subscribe(() => {
                  alert('Account updated successfully');
                  this.user.email = email; // Update user object locally
                  localStorage.setItem('user', JSON.stringify(this.user)); // Update local storage
                  this.editMode = false; // Exit edit mode after successful update
                  this.incorrectPassword = false; // Reset incorrect password flag
                });
            } else {
              // Update only email
              this.authService.updateUser(this.user.id, email).subscribe(() => {
                alert('Account updated successfully');
                this.user.email = email; // Update user object locally
                localStorage.setItem('user', JSON.stringify(this.user)); // Update local storage
                this.editMode = false; // Exit edit mode after successful update
                this.incorrectPassword = false; // Reset incorrect password flag
              });
            }
          } else {
            // Show error message for incorrect password
            this.incorrectPassword = true;
          }
        },
        (error) => {
          console.error('Error verifying password:', error);
          // Handle error case as per your application's requirements
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
