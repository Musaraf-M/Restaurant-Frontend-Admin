import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // Error messages
  public errorMessages = {
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Please enter a valid email address' },
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      { type: 'pattern', message: 'Password must have minimum 6 characters,one upper and one lower character with a special character' },
    ],
  };

  // Login validation
  loginForm = this.formBuilder.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
      ],
    ],
    password: [
      '',
      [
         Validators.required,
         Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/),
      ]
    ],
  });
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    
  ) {}

  ngOnInit(): void {
    const data = this.auth.getTokendata();
    if (data['role'] == 'admin') {
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['']);
    }
  }

  // Get user email
  get email(): AbstractControl {
    return this.loginForm.get('email');
  }
  // Get user password
  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

  // Login the user
  loginUser(): void {
    const cred = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
    };

    // Hit Login API
    this.api.loginUser(cred).subscribe((data) => {
      this.auth.setToken(data['auth-token']);
      this.router.navigate(['home']);
    });
  }
}
