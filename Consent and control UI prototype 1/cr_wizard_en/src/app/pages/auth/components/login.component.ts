import { NgRedux, select } from '@angular-redux/store';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../app.store';
import { AuthActions } from '../actions/auth.actions';
import { AppUser } from '../models/app-user';

@Component({
    selector: 'cr-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    @select((s: IAppState) => s.auth.error)
    error$: Observable<string>;

    constructor(
        private authActions: AuthActions,
        private ngRedux: NgRedux<IAppState>,
        private router: Router,
        private route: ActivatedRoute) {
            // TODO: Think about better place
            ngRedux.select<AppUser>(s => s.auth.user).subscribe(user => {
                if (user) {
                    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
                    this.router.navigate([returnUrl || '/']);
                }
            });
        }

    register(credentials) {
        const random = Math.random().toString(36).slice(-6);
        this.authActions.registerUser(random, random);
    }

    // login(credentials) {
    //     this.authActions.loginUser(credentials.username, credentials.password);
    // }
}
