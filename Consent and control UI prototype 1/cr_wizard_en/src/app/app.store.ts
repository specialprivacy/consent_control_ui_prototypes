import { combineReducers } from 'redux';

import { CORE_INITIAL_STATE, coreReducer, ICoreState } from './core/core.store';
import { AUTH_INITIAL_STATE, authReducer, IAuthState } from './pages/auth/auth.store';

export interface IAppState {
    auth: IAuthState;
    core: ICoreState;
}

export const APP_INITIAL_STATE: IAppState = {
    auth: AUTH_INITIAL_STATE,
    core: CORE_INITIAL_STATE
};

export const appReducer = combineReducers<IAppState>({
    auth: authReducer,
    core: coreReducer
});
