import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { FormComponent } from './components/form/form.component';
import { SubmissionComponent } from './components/submission/submission.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'signin', component: SignInComponent },
  { path: 'form', component: FormComponent, canActivate: [AuthGuard] },
  {
    path: 'submission',
    component: SubmissionComponent,
    canActivate: [AuthGuard],
  },
  { path: 'verifyemail', component: VerifyEmailComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
