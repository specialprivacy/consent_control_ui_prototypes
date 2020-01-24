import { NgRedux, select } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router/src/interfaces';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../app.store';
import { AppUser } from '../models/app-user';

@Injectable()
export class AuthGuard implements CanActivate {
    @select((s: IAppState) => s.auth.user)
    user$: Observable<AppUser>;

    constructor(
        private router: Router,
        private ngRedux: NgRedux<IAppState>) {}

    canActivate(route, state: RouterStateSnapshot): Observable<boolean> {
        return this.user$.map(user => {
            if (user) {
                return true;
            }

            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        });
    }

}
