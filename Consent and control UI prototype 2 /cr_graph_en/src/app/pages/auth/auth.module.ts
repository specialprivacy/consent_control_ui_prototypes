import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthActions } from './actions/auth.actions';
import { LoginComponent } from './components/login.component';
import { AuthEpics } from './epics/auth.epics';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        LoginComponent
    ],
    providers: [
        AuthService,
        AuthGuard,
        AuthActions,
        AuthEpics
    ],
})
export class AuthModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootAuthModule,
            providers: [AuthService, AuthGuard],
        };
    }
}

@NgModule({
    imports: [
        AuthModule,
        RouterModule.forRoot([{ path: 'login', component: LoginComponent }])
    ],
})
export class RootAuthModule { }
