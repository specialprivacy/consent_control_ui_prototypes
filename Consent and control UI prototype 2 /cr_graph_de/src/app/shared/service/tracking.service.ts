import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as zipper from 'js-string-compression';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../app.store';
import { AuthActions } from '../../pages/auth/actions/auth.actions';
import * as _ from 'lodash';

@Injectable()
export class TrackingService {
    private zip: any;

    constructor(
        private db: AngularFireDatabase,
        private ngRedux: NgRedux<IAppState>
    ) {
        this.zip = new zipper.Hauffman();
    }

    track(action: any) {
        if (
            action.type === AuthActions.LOGIN_USER ||
            action.type === AuthActions.REGISTER_USER ||
            action.type === AuthActions.GET_USER ||
            action.type === AuthActions.GET_USER_NOT_AUTHENTICATED) {
            return;
        }

        const userId = this.ngRedux.getState().auth.user.uid;
        const itemsRef = this.db.list('/logs2/' + userId);

        itemsRef.push(JSON.stringify(action));
    }

    loadLog(userId) {
        return this.db.list('/logs2/' + userId).snapshotChanges().map((actions) => {
            return actions.map(x => {
                const payload = x.payload.val();

                return payload;
            });
        });
    }

}
