import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { ICoreState } from '../core.store';

@Injectable()
export class OptionalPathActions {
    static SELECT_OPTIONAL_PATH = '[OPTIONAL PATH] SELECT_OPTIONAL_PATH';
    static SELECT_OPTIONAL_PATH_SUCCESS = '[OPTIONAL PATH] SELECT_OPTIONAL_PATH_SUCCESS';
    static DESELECT_OPTIONAL_PATH = '[OPTIONAL PATH] DESELECT_OPTIONAL_PATH';
    static DESELECT_OPTIONAL_PATH_SUCCESS = '[OPTIONAL PATH] DESELECT_OPTIONAL_PATH_SUCCESS';

    constructor(private ngRedux: NgRedux<ICoreState>) { }

    selectPath(optionalPathId: number) {
        this.ngRedux.dispatch({ type: OptionalPathActions.SELECT_OPTIONAL_PATH, payload: optionalPathId });
    }

    deselectPath(optionalPathId: number) {
        this.ngRedux.dispatch({ type: OptionalPathActions.DESELECT_OPTIONAL_PATH, payload: optionalPathId });
    }
}
