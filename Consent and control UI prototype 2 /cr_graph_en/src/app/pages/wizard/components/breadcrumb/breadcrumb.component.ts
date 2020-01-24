import { NgRedux } from '@angular-redux/store';
import { Component } from '@angular/core';

import { IAppState } from '../../../../app.store';
import { FilterActions } from '../../../../core/actions/filter.actions';
import { Group } from '../../../../core/models/group.model';
import { Item } from '../../../../core/models/item.model';
import { PathItem } from './models/path-item.model';

@Component({
    selector: 'cr-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {
    pathItems: PathItem[];

    constructor(
        private filterActions: FilterActions,
        private ngRedux: NgRedux<IAppState>,
    ) {
        ngRedux.select<Item[]>((s: IAppState) => s.core.itemsToFilterBy).subscribe(items => this.updatePath());
        ngRedux.select<Group>((s: IAppState) => s.core.groupToFilterBy).subscribe(items => this.updatePath());
    }

    onBreadCrumbItemClick(pathItem: PathItem) {
        this.filterActions.sliceToItem(pathItem.id);
    }

    private updatePath() {
        const groupToFilterBy = this.ngRedux.getState().core.groupToFilterBy;
        const itemsToFilterBy = this.ngRedux.getState().core.itemsToFilterBy;

        this.pathItems = [];
        itemsToFilterBy.forEach(x => {
            this.pathItems.push(this.createFromItem(x));
        });
        if (groupToFilterBy) {
            this.pathItems.push(this.createFromGroup(groupToFilterBy));
        }
    }

    private createFromGroup(group: Group) {
        return new PathItem({
            name: group.name,
            icon: group.icon
        });
    }

    private createFromItem(item: Item) {
        return new PathItem({
            id: item.id,
            name: item.name,
            icon: item.icon
        });
    }
}
