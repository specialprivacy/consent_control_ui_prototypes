import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';

import { IAuthState } from '../auth.store';
import { Credentials } from '../models/credentials';

@Injectable()
export class AuthActions {
    static GET_USER = '[AUTH] GET_USER';
    static GET_USER_SUCCESS = '[AUTH] GET_USER_SUCCESS';
    static GET_USER_NOT_AUTHENTICATED = '[AUTH] GET_USER_NOT_AUTHENTICATED';

    static REGISTER_USER = '[AUTH] REGISTER_USER';
    static REGISTER_USER_SUCCESS = '[AUTH] REGISTER_USER_SUCCESS';
    static REGISTER_USER_ERROR = '[AUTH] REGISTER_USER_ERROR';
    static LOGIN_USER = '[AUTH] LOGIN_USER';
    static LOGIN_USER_SUCCESS = '[AUTH] LOGIN_USER_SUCCESS';
    static LOGIN_USER_ERROR = '[AUTH] LOGIN_USER_ERROR';
    static LOGOUT_USER = '[AUTH] LOGOUT_USER';

    constructor(private ngRedux: NgRedux<IAuthState>) { }

    getUser() {
        this.ngRedux.dispatch({ type: AuthActions.GET_USER });
    }

    registerUser(userName: string, password: string) {
        this.ngRedux.dispatch({ type: AuthActions.REGISTER_USER, payload: new Credentials({ username: userName, password: password }) });
    }

    loginUser(userName: string, password: string) {
        this.ngRedux.dispatch({ type: AuthActions.LOGIN_USER, payload: new Credentials({ username: userName, password: password }) });
    }

    logoutUser() {
        this.ngRedux.dispatch({ type: AuthActions.LOGOUT_USER });
    }
}
