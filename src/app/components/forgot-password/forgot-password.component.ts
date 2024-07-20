import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit() {}

  resetPassword(email: string) {
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailPattern.test(email)) {
      this.authService.ForgotPassword(email);
    } else {
      window.alert('Please enter a valid email address.');
    }
  }
}
