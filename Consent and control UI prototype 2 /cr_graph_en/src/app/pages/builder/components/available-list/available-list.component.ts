import { NgRedux } from '@angular-redux/store';
import { Component } from '@angular/core';

import { IAppState } from '../../../../app.store';
import { ItemActions } from '../../../../core/actions/item.actions';
import { ItemHelper } from '../../../../core/helpers/item.helper';
import { AcceptedItem } from '../../../../core/models/accepted-item.model';
import { Item } from '../../../../core/models/item.model';

@Component({
  selector: 'cr-available-list',
  templateUrl: './available-list.component.html',
  styleUrls: ['./available-list.component.css']
})
export class AvailableListComponent {
    items: Item[] = [];
    selectedRowId: string;

    constructor(
        private itemHelper: ItemHelper,
        private ngRedux: NgRedux<IAppState>,
        private itemActions: ItemActions
    ) {
        ngRedux.select<Item>((s: IAppState) => s.core.selectedItem).subscribe(item => { this.selectedRowId = (item) ? item.id : null; });
        ngRedux.select<AcceptedItem[]>((s: IAppState) => s.core.acceptedItems).subscribe(items => { this.updateDataSource(items); });
    }

    onItemClick(row) {
        this.itemActions.selectItem(row.id);
    }

    private updateDataSource(items: AcceptedItem[]) {
        this.items = this.itemHelper.findPurposeItemsAvailable(items);
    }

}
