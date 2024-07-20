import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.afAuth.authState.pipe(
      take(1),
      map((user) => {
        if (!user) {
          console.log('Access denied - Not logged in');
          this.router.navigate(['signin']);
          return false;
        }
        return true;
      })
    );
  }
}
