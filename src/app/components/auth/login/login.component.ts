import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  @ViewChild('loginForm') loginForm: NgForm | undefined;
  errorMessage!: string;

  isSubmited: boolean = false;

  subscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin() {
    this.isSubmited = true;

    const email = this.loginForm?.controls['email'].value;
    const password = this.loginForm?.controls['password'].value;

    this.subscription = this.authService.signIn(email, password)
      .subscribe({
        next: result => {
          result.user?.updateProfile({ displayName: 'asf' })
          this.router.navigate(['/']);
        },
        error: error => {
          this.errorMessage = error.message;
          this.loginForm?.controls['password'].reset();
          this.isSubmited = false;
        }
      })
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
}