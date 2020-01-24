import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as crypto from 'crypto-js';
import { Observable } from 'rxjs/Observable';

import { AppUser } from '../models/app-user';
import { Credentials } from '../models/credentials';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AuthService {
    private readonly USERS_API = '/users2/';

    constructor(
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase) {}

    register(credentials: Credentials) {
        const email = this.buildUserFakeEmail(credentials.username);
        const auth$ = Observable.fromPromise(this.afAuth.auth.createUserWithEmailAndPassword(email, credentials.password))
            .switchMap(x => this.addUser(x.uid, email));

        return auth$.pipe(catchError(this.handleRegisterError));
    }

    login(credentials: Credentials): Observable<AppUser> {
        const email = this.buildUserFakeEmail(credentials.username);
        const auth$ = Observable.fromPromise(this.afAuth.auth.signInWithEmailAndPassword(email, credentials.password))
            .switchMap(x => this.getUserByUid(x.uid));

        return auth$.pipe(catchError(this.handleLoginError));
    }

    getUser(): Observable<AppUser | null> {
        return this.afAuth.authState.switchMap(user => (user)
            ? this.getUserByUid(user.uid)
            : Observable.of(null));
    }

    getAllUsers(): Observable<AppUser[]> {
        return this.db.list<AppUser>(this.USERS_API)
            .snapshotChanges()
            .map(actions => {
                return actions.map(action => (Object.assign(new AppUser(...action.payload.val(), action.key))));
            });
    }

    logout() {
        this.afAuth.auth.signOut();
    }

    private addUser(uid, email) {
        const userRef = this.db.object<AppUser>(this.USERS_API + uid);
        const user = new AppUser ({ email: email, isQuestionnaireable: true, uid: uid });

        return userRef.update(user).then(_ => this.getUserByUid(uid).toPromise());
    }

    private getUserByUid(uid: string) {
        const userRef = this.db.object<AppUser>(this.USERS_API + uid);
        const user$ = userRef.valueChanges().pipe(map(user => this.mapAppUser(user, uid)));

        return user$;
    }

    private buildUserFakeEmail(userName: string) {
        const hashName = crypto.SHA256(userName).toString();

        return hashName + '@user-concent-request.com';
    }

    private mapAppUser(user, uid) {
        if (!user) {
            return null;
        }

        return new AppUser({
            uid: uid,
            email: user.email,
            isAdmin: user.isAdmin,
            isQuestionnaireable: user.isQuestionnaireable,
            date: user.date,
            dateString: user.dateString
        });
    }

    private handleRegisterError(error) {
        const code = error.code;
        if (code === 'auth/email-already-in-use') {
            return new ErrorObservable('The user name is alredy is use.');
        }
        if (code === 'auth/weak-password') {
            return new ErrorObservable('Password should be at least 6 characters.');
        }
        if (code === 'auth/invalid-email') {
            return new ErrorObservable('The username should have alphanumeric characters.');
        }

        return new ErrorObservable(code);
    }

    private handleLoginError(error) {
        const code = error.code;
        if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-email') {
            return new ErrorObservable('Invalid username and/or password.');
        }

        return new ErrorObservable(code);
    }
}
