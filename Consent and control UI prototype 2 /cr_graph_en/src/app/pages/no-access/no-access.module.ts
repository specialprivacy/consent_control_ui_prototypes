import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NoAccessComponent } from './no-access.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'no-access', component: NoAccessComponent },
        ])
    ],
    declarations: [
        NoAccessComponent
    ]
})
export class NoAccessModule { }
