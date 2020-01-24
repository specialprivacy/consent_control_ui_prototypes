import { NgRedux } from '@angular-redux/store';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';

import { IAppState } from '../../../../app.store';
import { FilterActions } from '../../../../core/actions/filter.actions';
import { ItemActions } from '../../../../core/actions/item.actions';
import { FilteredItem } from '../../../../core/models/filtered-item.model';
import { Group } from '../../../../core/models/group.model';
import { Item } from '../../../../core/models/item.model';

@Component({
    selector: 'cr-request',
    templateUrl: './request.component.html',
    styleUrls: ['./request.component.css']
})
export class RequestComponent {
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    groups: Group[] = [];
    selectedRowId: string;

    private usedGroupTypes: string[] = [];

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private filterActions: FilterActions,
        private itemActions: ItemActions
    ) {
        ngRedux.select<Item>((s: IAppState) => s.core.selectedItem).subscribe(item => { this.selectedRowId = (item) ? item.id : null; });
        ngRedux.select<FilteredItem[]>((s: IAppState) => s.core.filteredItems).subscribe(items => { this.updateDataSource(items); });
        ngRedux.select<Group>((s: IAppState) => s.core.groupToFilterBy).subscribe(x => { this.updateGroups(x); });
        ngRedux.select<Item[]>((s: IAppState) => s.core.itemsToFilterBy).subscribe(x => { this.updateUsedGroups(x); });
    }

    disableClass(groupRecord: Group, item: FilteredItem): string {
        const isUsed = this.usedGroupTypes.includes(groupRecord.type);
        const hasConnections = item.connections.includes(groupRecord.type);

        return isUsed || !hasConnections ? 'disabled' : '';
    }

    onItemClick(item) {
        this.itemActions.selectItem(item.id);
    }

    onGroupClick(event, groupRecord: Group, record: Item) {
        event.stopPropagation();
        this.filterActions.setGroupAndAddItem(groupRecord.id, record.id);
    }

    onChange(checked, item: Item) {
        (checked)
        ? this.itemActions.accept(item.id)
        : this.itemActions.revoke(item.id);
    }

    private updateUsedGroups(items: Item[]) {
        this.usedGroupTypes = items.map(x => x.type);
    }

    private updateGroups(items: Group) {
        const store = this.ngRedux.getState();
        const groupToFilterBy = store.core.groupToFilterBy;
        if (groupToFilterBy) {
            this.groups = _.filter(store.core.groups, x => x.type !== groupToFilterBy.type);
        }
    }

    private updateDataSource(items: FilteredItem[]) {
        this.dataSource.data = items;
    }
}
