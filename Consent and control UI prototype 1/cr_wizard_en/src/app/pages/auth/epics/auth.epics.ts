import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';

import { Injectable } from '@angular/core';
import { Action } from 'redux';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs/Observable';

import { AuthActions } from '../actions/auth.actions';
import { Credentials } from '../models/credentials';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthEpics {
    constructor(
        private authActions: AuthActions,
        private authService: AuthService
    ) { }

    login = (action$: ActionsObservable<Action>) => {
        return action$.ofType(AuthActions.LOGIN_USER)
            .mergeMap(action => {
                const credentials: Credentials = (action as any).payload;

                return this.authService.login(credentials)
                    .map(user => ({ type: AuthActions.LOGIN_USER_SUCCESS, payload: user }))
                    .catch(error => Observable.of({ type: AuthActions.LOGIN_USER_ERROR, payload: error }));
            });
    }

    register = (action$: ActionsObservable<Action>) => {
        return action$.ofType(AuthActions.REGISTER_USER)
            .mergeMap(action => {
                const credentials: Credentials = (action as any).payload;

                return this.authService.register(credentials)
                    .map(user => ({ type: AuthActions.REGISTER_USER_SUCCESS, payload: user }))
                    .catch(error => Observable.of({ type: AuthActions.REGISTER_USER_ERROR, payload: error }));
            });
    }

    getUser = (action$: ActionsObservable<Action>) => {
        return action$.ofType(AuthActions.GET_USER)
            .mergeMap(action => {
                return this.authService.getUser()
                    .map(user => (user)
                        ? { type: AuthActions.GET_USER_SUCCESS, payload: user }
                        : { type: AuthActions.GET_USER_NOT_AUTHENTICATED })
                    .takeUntil(action$.ofType(AuthActions.LOGIN_USER_SUCCESS));
            });
    }
}
