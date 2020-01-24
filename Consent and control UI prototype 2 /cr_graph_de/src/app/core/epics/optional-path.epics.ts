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
import { OptionalPathActions } from '../actions/optional-path.actions';
import { ICoreState } from '../core.store';
import { NgRedux } from '@angular-redux/store';

import * as _ from 'lodash';
import { IAppState } from '../../app.store';

@Injectable()
export class OptionalPathEpics {
    constructor(
        private ngRedux: NgRedux<IAppState>
    ) { }

    selectPath = (action$: ActionsObservable<Action>) => {
        return action$.ofType(OptionalPathActions.SELECT_OPTIONAL_PATH)
            .map(action => {
                const pathId = (action as any).payload;
                const selected = this.ngRedux.getState().core.selectedOptionalPaths;

                if (!selected.find(x => x.id === pathId)) {
                    selected.push(this.ngRedux.getState().core.optionalPaths.find(x => x.id === pathId));
                }

                return { type: OptionalPathActions.SELECT_OPTIONAL_PATH_SUCCESS, payload: selected };
            });
    }

    deselectPath = (action$: ActionsObservable<Action>) => {
        return action$.ofType(OptionalPathActions.DESELECT_OPTIONAL_PATH)
            .map(action => {
                const pathId = (action as any).payload;
                const selected = this.ngRedux.getState().core.selectedOptionalPaths;

                _.remove(selected, x => x.id === pathId);

                return { type: OptionalPathActions.DESELECT_OPTIONAL_PATH_SUCCESS, payload: selected };
            });
    }
}
