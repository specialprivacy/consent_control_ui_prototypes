import { NgRedux } from '@angular-redux/store';
import { Component } from '@angular/core';

import { IAppState } from './app.store';

@Component({
    selector: 'cr-app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    show: boolean;

    constructor(
        private ngRedux: NgRedux<IAppState>) {
        ngRedux.select<boolean>((s: IAppState) => s.auth.isPending).subscribe(isPending => {
            this.show = isPending;
        });
    }
}
