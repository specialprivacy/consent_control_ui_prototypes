import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';

import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { Action } from 'redux';
import { ActionsObservable } from 'redux-observable';

import { FilterActions } from '../actions/filter.actions';
import { GroupActions } from '../actions/group.actions';
import { ICoreState } from '../core.store';
import { ItemHelper } from '../helpers/item.helper';
import { IAppState } from '../../app.store';

@Injectable()
export class FilterEpics {
    constructor(
        private itemHelper: ItemHelper,
        private ngRedux: NgRedux<ICoreState>
    ) { }

    setGroupFilter = (action$: ActionsObservable<Action>) => {
        return action$.ofType(FilterActions.SET_GROUP_FILTER)
            .map(action => {
                const groupId = (action as any).payload.groupId;
                const filteredItems = this.itemHelper.filterItemsByGroup(groupId);

                return { type: FilterActions.SET_GROUP_FILTER_SUCCESS, payload: {filteredItems, groupId} };
            });
    }

    setGroupAndAddItemFilter = (action$: ActionsObservable<Action>, store) => {
        return action$.ofType(FilterActions.SET_GROUP_AND_ADD_ITEM_FILTER)
            .map(action => {
                const payload = (action as any).payload;
                const groupIdToFilterBy = payload.groupId;
                const itemIdsToFilterBy = store.getState().core.itemsToFilterBy.map(x => x.id);
                itemIdsToFilterBy.push(payload.itemId);

                const filteredItems = this.itemHelper.filterItemsByGroupByItems(groupIdToFilterBy, itemIdsToFilterBy);

                return { type: FilterActions.SET_GROUP_AND_ADD_ITEM_FILTER_SUCCESS, payload: {filteredItems, itemIdsToFilterBy, groupIdToFilterBy} };
            });
    }

    sliceFilterToItem = (action$: ActionsObservable<Action>, store: NgRedux<IAppState>) => {
        return action$.ofType(FilterActions.SLICE_FILTER_TO_ITEM)
            .map(action => {
                const payload = (action as any).payload;
                const item = store.getState().core.items.find(x => x.id === payload.itemId);
                const groupIdToFilterBy = store.getState().core.groups.find(x => x.type === item.type).type;
                let itemIdsToFilterBy = store.getState().core.itemsToFilterBy.map(x => x.id);
                itemIdsToFilterBy = itemIdsToFilterBy.slice(0, itemIdsToFilterBy.indexOf(item.id));

                const filteredItems = this.itemHelper.filterItemsByGroupByItems(groupIdToFilterBy, itemIdsToFilterBy);

                return {
                    type: FilterActions.SLICE_FILTER_TO_ITEM_SUCCESS,
                    payload: {filteredItems, itemIdsToFilterBy, groupIdToFilterBy, item}
                };
            });
    }
}
