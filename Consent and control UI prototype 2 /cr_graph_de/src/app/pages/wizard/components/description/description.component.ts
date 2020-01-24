import { Component, OnInit } from '@angular/core';
import { IAppState } from '../../../../app.store';
import { Observable } from 'rxjs/Observable';
import { Group } from '../../../../core/models/group.model';
import { select, NgRedux } from '@angular-redux/store';

@Component({
    selector: 'cr-description',
    templateUrl: './description.component.html',
    styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {
    @select((s: IAppState) => s.core.groupToFilterBy)
    readonly selectedGroup$: Observable<Group>;

    constructor(
        private ngRedux: NgRedux<IAppState>
    ) { }

    ngOnInit() {
    }

}
