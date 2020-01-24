import { DevToolsExtension, NgRedux, NgReduxModule } from '@angular-redux/store';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { isDevMode, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { createEpicMiddleware } from 'redux-observable';
import * as _ from 'lodash';


import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { APP_INITIAL_STATE, appReducer, IAppState } from './app.store';
import { AppActions } from './core/actions/app.actions';
import { GroupActions } from './core/actions/group.actions';
import { ItemActions } from './core/actions/item.actions';
import { CoreModule } from './core/core.module';
import { AppEpics } from './core/epics/app.epics';
import { FilterEpics } from './core/epics/filter.epics';
import { GroupEpics } from './core/epics/group.epics';
import { ItemEpics } from './core/epics/item.epics';
import { AdminComponent } from './pages/admin/admin.component';
import { AuthActions } from './pages/auth/actions/auth.actions';
import { AuthModule } from './pages/auth/auth.module';
import { AuthEpics } from './pages/auth/epics/auth.epics';
import { AdminAuthGuard } from './pages/auth/services/admin-auth-guard.service';
import { AuthGuard } from './pages/auth/services/auth-guard.service';
import { NoAccessModule } from './pages/no-access/no-access.module';
import { NoPageComponent } from './pages/no-page/no-page.component';
import { NoPageModule } from './pages/no-page/no-page.module';
import { WizardModule } from './pages/wizard/wizard.module';
import { InfoDialogComponent } from './shared/components/dialogs/info.dialog.component';
import { MaterialModule } from './shared/material.module';
import { DataService } from './shared/service/data.service';
import { BuilderModule } from './pages/builder/builder.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ConfirmDialogComponent } from './shared/components/dialogs/confirm-dialog.component';
import { InfoDialog2Component } from './shared/components/dialogs/info-dialog/info-dialog.component';
import { OptionalPathEpics } from './core/epics/optional-path.epics';
import { TrackingService } from './shared/service/tracking.service';

import { createLogger } from 'redux-logger';

@NgModule({
    declarations: [
        AppComponent,
        InfoDialogComponent,
        InfoDialog2Component,
        AdminComponent,
        ConfirmDialogComponent
    ],
    entryComponents: [
        InfoDialogComponent,
        ConfirmDialogComponent,
        InfoDialog2Component
    ],
    imports: [
        RouterModule.forRoot([
            { path: '', component: NoPageComponent },
            { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminAuthGuard] }
        ]),
        FlexLayoutModule,
        AngularFireDatabaseModule,
        AngularFireModule.initializeApp(environment.firebase),
        AuthModule.forRoot(),
        NoAccessModule,
        NoPageModule,
        RouterModule,
        MaterialModule,
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        NgReduxModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        HttpClientModule,
        WizardModule,
        BuilderModule,
        CoreModule
    ],
    providers: [
        AngularFireAuth,
        AngularFireDatabase,
        DataService,
        AuthGuard,
        AdminAuthGuard,
        TrackingService,
    ],
    bootstrap: [AppComponent],
    exports: [
        RouterModule,
        CoreModule
    ]
})
export class AppModule {
    constructor(
        private authActions: AuthActions,
        private groupActions: GroupActions,
        private itemActions: ItemActions,
        devTools: DevToolsExtension,
        authEpics: AuthEpics,
        groupEpics: GroupEpics,
        filterEpics: FilterEpics,
        itemEpics: ItemEpics,
        appEpics: AppEpics,
        optionalPathEpics: OptionalPathEpics,
        private appActions: AppActions,
        trackingService: TrackingService,
        ngRedux: NgRedux<IAppState>) {

        const authMiddleware = [
            createEpicMiddleware(authEpics.login),
            createEpicMiddleware(authEpics.register),
            createEpicMiddleware(authEpics.getUser),
            createEpicMiddleware(groupEpics.loadGroups),
            createEpicMiddleware(filterEpics.setGroupFilter),
            createEpicMiddleware(filterEpics.setGroupAndAddItemFilter),
            createEpicMiddleware(filterEpics.sliceFilterToItem),
            createEpicMiddleware(itemEpics.loadItems),
            createEpicMiddleware(itemEpics.accept),
            createEpicMiddleware(itemEpics.revoke),
            createEpicMiddleware(appEpics.getUser),
            createEpicMiddleware(appEpics.loginUser),
            createEpicMiddleware(appEpics.loadInitialData),
            createEpicMiddleware(itemEpics.loadAcceptedItems),
            createEpicMiddleware(optionalPathEpics.deselectPath),
            createEpicMiddleware(optionalPathEpics.selectPath),

            createLogger(
                {
                    titleFormatter: (action: any, time: string, took: number) => action.type,
                    logger: {
                        log: function (name, style, action) {
                            if (_.startsWith(name, '%c action')) {
                                trackingService.track(action);
                            }
                        }
                    }
                }
            )
        ];

        const enhancers = isDevMode() ? [devTools.enhancer()] : [];
        ngRedux.configureStore(appReducer, APP_INITIAL_STATE, authMiddleware, []);

        this.authActions.getUser();
    }
}
