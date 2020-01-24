import { NgRedux, select } from '@angular-redux/store';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../../app.store';
import { GroupActions } from '../../../../core/actions/group.actions';
import { Group } from '../../../../core/models/group.model';
import { FilterActions } from '../../../../core/actions/filter.actions';

@Component({
    selector: 'cr-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.css']
})
export class TabsComponent {
    selectedIndex: number = 0;
    groups: Group[];

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private filterActions: FilterActions
    ) {
        this.ngRedux.select((s: IAppState) => s.core.groups).subscribe(x => this.updateGroups(x));
        this.ngRedux.select((s: IAppState) => s.core.groupToFilterBy).subscribe(x => this.updateSelectedIndex(x));
    }

    onGroupClick(groupIndex) {
        this.filterActions.setGroup(this.groups[groupIndex].id);
    }

    private updateGroups(groups: Group[]) {
        if (groups.length === 0) {
            return;
        }

        this.groups = groups;
        this.onGroupClick(0);
    }

    private updateSelectedIndex(group: Group) {
        if (!group) {
            return;
        }

        this.selectedIndex = this.groups.indexOf(group);
    }
}
