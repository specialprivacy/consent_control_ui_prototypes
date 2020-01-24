import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { ICoreState } from '../core.store';

@Injectable()
export class GroupActions {
    static LOAD_GROUP = '[GROUP] LOAD_GROUP';
    static LOAD_GROUP_SUCCESS = '[GROUP] LOAD_GROUP_SUCCESS';

    constructor(private ngRedux: NgRedux<ICoreState>) { }

    loadGroups() {
        this.ngRedux.dispatch({ type: GroupActions.LOAD_GROUP });
    }
}
