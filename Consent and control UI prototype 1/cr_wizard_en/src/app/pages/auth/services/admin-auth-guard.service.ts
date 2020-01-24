import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { IAppState } from '../../../app.store';
import { AppUser } from '../models/app-user';
import { NgRedux, select } from '@angular-redux/store';

@Injectable()
export class AdminAuthGuard implements CanActivate {
    @select((s: IAppState) => s.auth.user)
    user$: Observable<AppUser>;

    constructor(
        private router: Router) { }

    canActivate(route, state: RouterStateSnapshot): Observable<boolean>  {
        return this.user$.map(user => {
            if (user && user.isAdmin) {
                return true;
            }

            this.router.navigate(['/no-access']);
            return false;
        });
    }

}
