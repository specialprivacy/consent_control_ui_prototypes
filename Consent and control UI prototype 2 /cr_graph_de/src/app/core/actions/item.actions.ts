import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { ICoreState } from '../core.store';

@Injectable()
export class ItemActions {

    static LOAD_ACCEPT_ITEM_SUCCESS = '[ITEMS] LOAD_ACCEPT_ITEM_SUCCESS';
    static LOAD_ITEMS = '[ITEMS] LOAD_ITEMS';
    static LOAD_ITEMS_SUCCESS = '[ITEMS] LOAD_ITEMS_SUCCESS';
    static SELECT_ITEM = '[ITEMS] SELECT_ITEM';
    static SELECT_ITEM_EXTENDED = '[ITEMS] SELECT_ITEM_EXTENDED';
    static DESELECT_ITEM_EXTENDED = '[ITEMS] DESELECT_ITEM_EXTENDED';
    static ACCEPT_ITEM = '[ITEMS] ACCEPT_ITEM';
    static ACCEPT_ITEM_SUCCESS = '[ITEMS] ACCEPT_ITEM_SUCCESS';
    static REVOKE_ITEM = '[ITEMS] REVOKE_ITEM';
    static REVOKE_ITEM_SUCCESS = '[ITEMS] REVOKE_ITEM_SUCCESS';

    constructor(private ngRedux: NgRedux<ICoreState>) { }

    loadItems() {
        this.ngRedux.dispatch({ type: ItemActions.LOAD_ITEMS });
    }

    selectItem(itemId: string) {
        this.ngRedux.dispatch({ type: ItemActions.SELECT_ITEM, payload: itemId });
    }

    selectItemExtended() {
        this.ngRedux.dispatch({ type: ItemActions.SELECT_ITEM_EXTENDED });
    }

    deselectItemExtended() {
        this.ngRedux.dispatch({ type: ItemActions.DESELECT_ITEM_EXTENDED });
    }

    accept(itemId) {
        this.ngRedux.dispatch({ type: ItemActions.ACCEPT_ITEM, payload: {itemId} });
    }

    revoke(itemId) {
        this.ngRedux.dispatch({ type: ItemActions.REVOKE_ITEM, payload: {itemId} });
    }
}
