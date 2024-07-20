import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.afAuth.authState.subscribe((user) => {
      console.log('Auth state changed:', user);
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
        if (this.isEmailVerified(user)) {
          this.ngZone.run(() => {
            console.log('Navigating to form page from authState subscription');
            this.router
              .navigate(['form'])
              .then(() => {
                console.log('Navigation complete from authState subscription');
              })
              .catch((navError) => {
                console.error(
                  'Navigation error from authState subscription:',
                  navError
                );
              });
          });
        }
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (this.isEmailVerified(result.user)) {
          this.SetUserData(result.user);
          this.ngZone.run(() => {
            this.router.navigate(['form']);
          });
        } else {
          this.SendVerificationMail();
          throw new Error('Please verify your email before signing in.');
        }
      })
      .catch((error) => {
        window.alert('Please enter valid Credentials');
      });
  }

  // Sign up with email/password
  SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        console.log('User created successfully');
        return this.SendVerificationMail().then(() => {
          // Set user data after sending verification email
          return this.SetUserData(result.user).then(() => {
            // Manually set userData to prevent automatic navigation
            this.userData = result.user;
            this.userData.emailVerified = false;
            localStorage.setItem('user', JSON.stringify(this.userData));
            // Navigate to verify email page
            this.ngZone.run(() => {
              this.router.navigate(['verifyemail']);
            });
            return true;
          });
        });
      })
      .catch((error) => {
        console.error('SignUp error:', error);
        window.alert(`SignUp error: ${error.message}`);
        return false;
      });
  }

  // Send email verification when new user signs up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.ngZone.run(() => {
          this.router.navigate(['verifyemail']);
        });
      });
  }

  // Reset forgotten password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is logged in and email is verified (for email login only)
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    console.log('isLoggedIn check - user:', user);
    return (
      user !== null &&
      (this.isEmailVerified(user) ||
        user.providerData.some(
          (p: { providerId: string }) =>
            p.providerId === 'facebook.com' || p.providerId === 'google.com'
        ))
    );
  }

  // Helper method to check email verification status
  isEmailVerified(user: any): boolean {
    return (
      user.emailVerified ||
      user.providerData.some(
        (p: { providerId: string }) => p.providerId !== 'password'
      )
    );
  }

  // Setting up user data when sign in with username/password,
  // sign up with username/password, and sign in with social auth
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'User', // Default display name if none provided
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, { merge: true });
  }

  // Google Sign-in
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider())
      .then((result) => {
        console.log('Google Auth successful:', result);
        this.ngZone.run(() => {
          this.router.navigate(['form']);
        });
      })
      .catch((error) => {
        console.error('Google Auth Error:', error);
        window.alert('Google Auth Error: ' + error.message);
      });
  }

  // Facebook Sign-in
  FacebookAuth() {
    console.log('Starting Facebook Auth');
    return this.AuthLogin(new auth.FacebookAuthProvider())
      .then((user) => {
        console.log('Facebook Auth successful, user:', user);
        return new Promise((resolve) => setTimeout(resolve, 500)); // Add a small delay
      })
      .then(() => {
        this.ngZone.run(() => {
          console.log('Attempting to navigate to form page');
          this.router
            .navigate(['form'])
            .then(() => {
              console.log('Navigation complete');
            })
            .catch((navError) => {
              console.error('Navigation error:', navError);
            });
        });
      })
      .catch((error) => {
        console.error('Facebook Auth Error:', error);
        window.alert('Facebook Auth Error: ' + error.message);
      });
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        console.log('AuthLogin result:', result);
        if (result.user) {
          return this.SetUserData(result.user).then(() => result.user);
        } else {
          throw new Error('No user returned from authentication');
        }
      })
      .catch((error) => {
        console.error('AuthLogin error:', error);
        window.alert(`AuthLogin error: ${error.message}`);
        throw error;
      });
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.ngZone.run(() => {
        this.router.navigate(['signin']);
      });
    });
  }
}
