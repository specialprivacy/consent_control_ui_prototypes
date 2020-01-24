import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { Group } from '../models/group.model';

@Injectable()
export class GroupService {
    private readonly GROUPS_API = '/groups/';

    constructor(
        private db: AngularFireDatabase) {}

    load() {
        return this.db.list<Group>(this.GROUPS_API)
            .valueChanges()
            .pipe(map(groups => _.map(groups, x => new Group().parseJSON(x))));
    }
}
