import { tassign } from 'tassign';

import { AuthActions } from './actions/auth.actions';
import { AppUser } from './models/app-user';

export interface IAuthState {
    user: AppUser | null;
    error: string;
    isPending: boolean;
}

export const AUTH_INITIAL_STATE: IAuthState = {
    user: null,
    error: null,
    isPending: false
};

export function authReducer(state: IAuthState = AUTH_INITIAL_STATE, action): IAuthState {
    switch (action.type) {
        case AuthActions.REGISTER_USER:
        case AuthActions.LOGIN_USER:
            return tassign(state, {
                isPending: true,
                error: null,
                user: null
            });
        case AuthActions.LOGIN_USER_SUCCESS:
            return tassign(state, {
                isPending: false,
                error: null,
                user: action.payload
            });
        case AuthActions.REGISTER_USER_ERROR:
        case AuthActions.LOGIN_USER_ERROR:
            return tassign(state, {
                isPending: false,
                error: action.payload,
                user: null
            });
        case AuthActions.GET_USER:
            return tassign(state, {
                isPending: true
            });
        case AuthActions.GET_USER_SUCCESS:
            return tassign(state, {
                isPending: false,
                user: action.payload
            });
        case AuthActions.GET_USER_NOT_AUTHENTICATED:
            return tassign(state, {
                isPending: false,
                user: null
            });
    }

    return state;
}
