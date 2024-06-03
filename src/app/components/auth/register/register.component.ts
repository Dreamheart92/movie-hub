import { Component, OnDestroy, ViewChild, ɵflushModuleScopingQueueAsMuchAsPossible } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgForm } from '@angular/forms';
import { Subscription, catchError, from, throwError } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy {
  @ViewChild('registerForm') registerForm: NgForm | undefined;

  @ViewChild('repeatPassword') repeatPassword: NgForm | undefined;

  errorMessage!: string;
  isSubmited: boolean = false;

  subscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  onSubmit() {
    this.isSubmited = true;

    const { username, email, password, repeatPassword } = this.registerForm?.value;
    const validPassword = this.passwordMatch(password, repeatPassword);

    if (validPassword) {
      this.subscription = this.authService.signUp(email, password)
        .subscribe({
          next: result => {

            const uid = result.user?.uid;

            if (email !== undefined && email !== null && uid !== undefined && uid !== null) {
              this.authService.registerUserToDb(username, email, uid);
              this.router.navigate(['/']);
            }
          },
          error: error => {
            this.errorMessage = error.message;
            this.resetPasswords();
            this.isSubmited = false;
          }
        })
    } else {
      this.isSubmited = false;
    }
  }

  passwordMatch(password: string, repeatPassword: string) {
    const passwordInput = this.registerForm?.controls?.['password'];
    const repeatPasswordInput = this.registerForm?.controls?.['repeatPassword'];
    if (password !== repeatPassword) {
      this.resetPasswords();
      passwordInput?.setErrors({ passwordMismatch: true })
      repeatPasswordInput?.setErrors({ passwordMismatch: true });
      return false;
    }

    passwordInput?.setErrors(null);
    repeatPasswordInput?.setErrors(null);
    return true;
  }

  resetPasswords() {
    this.registerForm?.controls?.['password'].reset();
    this.registerForm?.controls?.['repeatPassword'].reset();
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
}
