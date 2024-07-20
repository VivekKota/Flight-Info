import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  signUpMode: boolean = false;
  emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  toggleSignUp(): void {
    this.signUpMode = !this.signUpMode;
  }

  onSignIn(event: Event, email: string, password: string): void {
    event.preventDefault();
    if (!email || !password) {
      window.alert('Please Enter Valid Credentials');
      return;
    }

    if (!this.emailPattern.test(email)) {
      window.alert('Invalid email address');
      return;
    }

    console.log(`Signing in with email: ${email} and password: ${password}`);
    this.authService.SignIn(email, password);
  }

  onSignUp(
    event: Event,
    email: HTMLInputElement,
    password: HTMLInputElement,
    confirmPassword: HTMLInputElement
  ): void {
    event.preventDefault();

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

    this.resetErrorMessages();

    if (!this.emailPattern.test(emailValue)) {
      this.showErrorMessage(email, 'Invalid email address');
      return;
    }

    // Validate password length
    if (passwordValue.length < 8) {
      this.showErrorMessage(
        password,
        'Password must be at least 8 characters long'
      );
      return;
    }

    // Validate password match
    if (passwordValue !== confirmPasswordValue) {
      this.showErrorMessage(confirmPassword, 'Passwords do not match');
      return;
    }

    console.log(
      `Signing up with email: ${emailValue} and password: ${passwordValue}`
    );
    this.authService.SignUp(emailValue, passwordValue).then((success) => {
      if (success) {
        this.toggleSignUp();
      }
    });
  }

  googleAuth(event: Event): void {
    event.preventDefault();
    this.authService.GoogleAuth();
  }

  facebookAuth(event: Event): void {
    event.preventDefault();
    this.authService.FacebookAuth();
  }

  showErrorMessage(inputElement: HTMLInputElement, message: string): void {
    const errorElement = inputElement.parentElement!
      .nextElementSibling as HTMLElement;
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  resetErrorMessages(): void {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
  }
}
