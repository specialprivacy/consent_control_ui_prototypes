import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';

import { ICoreState } from '../core.store';

@Injectable()
export class FilterActions {
    static SET_GROUP_FILTER = '[FILTER] SET_GROUP_FILTER';
    static SET_GROUP_FILTER_SUCCESS = '[FILTER] SET_GROUP_FILTER_SUCCESS';
    static SET_GROUP_AND_ADD_ITEM_FILTER = '[FILTER] SET_GROUP_AND_ADD_ITEM_FILTER';
    static SET_GROUP_AND_ADD_ITEM_FILTER_SUCCESS = '[FILTER] SET_GROUP_AND_ADD_ITEM_FILTER_SUCCESS';
    static SLICE_FILTER_TO_ITEM = '[FILTER] SLICE_FILTER_TO_ITEM';
    static SLICE_FILTER_TO_ITEM_SUCCESS = '[FILTER] SLICE_FILTER_TO_ITEM_SUCCESS';

    constructor(private ngRedux: NgRedux<ICoreState>) { }

    setGroup(groupId: string) {
        this.ngRedux.dispatch({ type: FilterActions.SET_GROUP_FILTER, payload: {groupId} });
    }

    setGroupAndAddItem(groupId: string, itemId: string) {
        this.ngRedux.dispatch({ type: FilterActions.SET_GROUP_AND_ADD_ITEM_FILTER, payload: {groupId, itemId} });
    }

    sliceToItem(itemId: string) {
        this.ngRedux.dispatch({ type: FilterActions.SLICE_FILTER_TO_ITEM, payload: {itemId} });
    }
}
