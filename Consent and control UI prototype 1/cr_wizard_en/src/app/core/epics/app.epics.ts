import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/zip';

import { Injectable } from '@angular/core';
import { Action } from 'redux';
import { ActionsObservable } from 'redux-observable';

import { AppActions } from '../actions/app.actions';
import { AcceptedItemService } from '../services/accepted-item.service';
import { GroupService } from '../services/group.service';
import { ItemService } from '../services/item.service';
import { AuthActions } from '../../pages/auth/actions/auth.actions';
import { OptionalPath } from '../models/optional-path.model';

@Injectable()
export class AppEpics {
    constructor(
        private itemService: ItemService,
        private acceptedItemService: AcceptedItemService,
        private groupService: GroupService
    ) { }

    getUser = (action$: ActionsObservable<Action>) => {
        return action$.ofType(AuthActions.GET_USER_SUCCESS)
            .map(action => {
                return { type: AppActions.LOAD_INITIAL_DATA };
            });
    }

    loginUser = (action$: ActionsObservable<Action>) => {
        return action$.ofType(AuthActions.LOGIN_USER_SUCCESS)
            .map(action => {
                return { type: AppActions.LOAD_INITIAL_DATA };
            });
    }

    loadInitialData = (action$: ActionsObservable<Action>) => {
        let groups = [];
        let items = [];
        let acceptedItems = [];
        return action$.ofType(AppActions.LOAD_INITIAL_DATA)
            .flatMap(() => {
                return this.groupService.load();
            })
            .flatMap(groupResult => {
                groups = groupResult;
                return this.itemService.load();
            })
            .flatMap(itemResult => {
                items = itemResult;
                return this.acceptedItemService.load();
            })
            .map(acceptedItemResult => {
                acceptedItems = acceptedItemResult;
                return ({
                    type: AppActions.LOAD_INITIAL_DATA_SUCCESS,
                    payload: {
                        items: items,
                        groups: groups,
                        acceptedItems: acceptedItems,
                        optionalPaths: [
                            new OptionalPath({id: 1, path: ['storage_2', 'sharing_1', 'processing_3']}),
                            new OptionalPath({id: 2, path: ['storage_2', 'sharing_2', 'processing_4']}),
                            new OptionalPath({id: 3, path: ['storage_2', 'sharing_3', 'processing_5']}),
                            new OptionalPath({id: 4, path: ['storage_2', 'sharing_4', 'processing_6']})
                        ]
                    }
                });
            })
            .takeUntil(action$.ofType(AppActions.LOAD_INITIAL_DATA_SUCCESS));
    }
}
