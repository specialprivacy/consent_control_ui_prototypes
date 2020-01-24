import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';

import { Item } from '../models/item.model';

@Injectable()
export class ItemService {
    private readonly ITEMS_API = '/items/';

    constructor(
        private db: AngularFireDatabase) {}

    load() {
        return this.db.list<Item>(this.ITEMS_API)
            .valueChanges()
            .pipe(map(items => _.map(items, x => new Item().parseJSON(x))));
    }
}
