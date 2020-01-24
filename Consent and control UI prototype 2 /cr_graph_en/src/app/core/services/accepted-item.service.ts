import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as _ from 'lodash';

import { IAppState } from '../../app.store';
import { DataHelper } from '../../shared/helpers/data.helper';
import { AcceptedItem } from '../models/accepted-item.model';

@Injectable()
export class AcceptedItemService {
    private readonly ACCEPTED_ITEM_API: string = '/accepted-items';

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private db: AngularFireDatabase) {}

    load() {
        const state = this.ngRedux.getState();
        return this.db.list<AcceptedItem>(`${this.ACCEPTED_ITEM_API}/${state.core.mode}/${state.auth.user.uid}`)
            .snapshotChanges()
            .map(actions => {
                return actions.map(action => ({ $key: action.key, ...action.payload.val() }));
            });
    }

    accept(itemId: string) {
        const state = this.ngRedux.getState();
        const store = state.core;
        const currentItem = DataHelper.findItemById(store.items, itemId);
        const result = DataHelper.buildPath(store.items, currentItem);
        const itemsToFilterBy = store.itemsToFilterBy.map(x => x.id);
        const resultFiltered = DataHelper.filterPath(result, itemsToFilterBy);
        const pathToSave = [];

        resultFiltered.forEach(filteredItem => {
            let containsOptional = false;
            store.optionalPaths.forEach(optionalPath => {
                if (_.isEqual(_.intersection(filteredItem, optionalPath.path), optionalPath.path)) {
                    containsOptional = true;
                }
            });

            if (!containsOptional) {
                pathToSave.push(filteredItem);
            }
        });

        resultFiltered.forEach(filteredItem => {
            store.selectedOptionalPaths.forEach(selectedOptional => {
                if (_.isEqual(_.intersection(filteredItem, selectedOptional.path), selectedOptional.path)) {
                    pathToSave.push(filteredItem);
                }
            });
        });

        pathToSave.forEach(path => {
            if (_.find(store.acceptedItems, x => _.isEqual(x.path, path))) {
                return;
            }

            this.db.list<AcceptedItem>(`${this.ACCEPTED_ITEM_API}/${state.core.mode}/${state.auth.user.uid}`)
                .push(new AcceptedItem({path: path}));
        });
    }

    revoke(itemId: string) {
        const state = this.ngRedux.getState();
        const store = state.core;
        const currentItem = DataHelper.findItemById(store.items, itemId);
        const result = DataHelper.buildPath(store.items, currentItem);
        const resultFiltered = DataHelper.filterPath(result, store.itemsToFilterBy.map(x => x.id));
        // debugger
        resultFiltered.forEach(path => {
            const acceptedPath = _.find(store.acceptedItems, x => _.isEqual(x.path, path));
            if (acceptedPath) {
                const key = (acceptedPath as any).$key;
                this.db.list(`${this.ACCEPTED_ITEM_API}/${state.core.mode}/${state.auth.user.uid}/${key}`).remove();
            }
        });
    }
}
