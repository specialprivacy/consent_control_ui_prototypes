import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';

import { Injectable } from '@angular/core';
import { Action } from 'redux';
import { ActionsObservable } from 'redux-observable';

import { GroupActions } from '../actions/group.actions';
import { GroupService } from '../services/group.service';
import { FilterActions } from '../actions/filter.actions';

@Injectable()
export class GroupEpics {
    constructor(
        private groupActions: GroupActions,
        private groupService: GroupService
    ) { }

    loadGroups = (action$: ActionsObservable<Action>) => {
        return action$.ofType(GroupActions.LOAD_GROUP)
            .mergeMap(action => {
                return this.groupService.load()
                    .map(groups => ({ type: GroupActions.LOAD_GROUP_SUCCESS, payload: groups }))
                    .takeUntil(action$.ofType(GroupActions.LOAD_GROUP_SUCCESS));
            });
    }
}
