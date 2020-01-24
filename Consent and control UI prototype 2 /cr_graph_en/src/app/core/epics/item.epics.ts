import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';

import { Injectable } from '@angular/core';
import { Action } from 'redux';
import { ActionsObservable } from 'redux-observable';

import { ItemActions } from '../actions/item.actions';
import { ItemService } from '../services/item.service';
import { ItemHelper } from '../helpers/item.helper';
import { AcceptedItemService } from '../services/accepted-item.service';

@Injectable()
export class ItemEpics {
    constructor(
        private itemActions: ItemActions,
        private itemService: ItemService,
        private acceptedItemService: AcceptedItemService,
        private itemHelper: ItemHelper
    ) { }

    loadItems = (action$: ActionsObservable<Action>) => {
        return action$.ofType(ItemActions.LOAD_ITEMS)
            .mergeMap(action => {
                return this.itemService.load()
                    .map(items => ({ type: ItemActions.LOAD_ITEMS_SUCCESS, payload: items }))
                    .takeUntil(action$.ofType(ItemActions.LOAD_ITEMS_SUCCESS));
            });
    }

    loadAcceptedItems = (action$: ActionsObservable<Action>) => {
        return action$.filter(action => action.type === ItemActions.ACCEPT_ITEM_SUCCESS || action.type === ItemActions.REVOKE_ITEM_SUCCESS)
            .mergeMap(action => {
                return this.acceptedItemService.load()
                    .map(items => ({ type: ItemActions.LOAD_ACCEPT_ITEM_SUCCESS, payload: items }))
                    .takeUntil(action$.ofType(ItemActions.LOAD_ACCEPT_ITEM_SUCCESS));
            });
    }

    accept = (action$: ActionsObservable<Action>) => {
        return action$.ofType(ItemActions.ACCEPT_ITEM)
            .map(action => {
                const itemId = (action as any).payload.itemId;
                this.acceptedItemService.accept(itemId);

                return { type: ItemActions.ACCEPT_ITEM_SUCCESS };
            });
    }

    revoke = (action$: ActionsObservable<Action>) => {
        return action$.ofType(ItemActions.REVOKE_ITEM)
            .map(action => {
                const itemId = (action as any).payload.itemId;
                this.acceptedItemService.revoke(itemId);

                return { type: ItemActions.REVOKE_ITEM_SUCCESS };
            });
    }
}
