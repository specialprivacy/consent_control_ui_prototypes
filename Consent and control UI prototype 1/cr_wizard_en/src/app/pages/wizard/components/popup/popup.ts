import { NgRedux } from '@angular-redux/store';
import { select } from '@angular-redux/store/lib/src/decorators/select';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../../app.store';
import { Group } from '../../../../core/models/group.model';
import { Item } from '../../../../core/models/item.model';
import { GraphComponent } from './../graph/graph.component';
import { Graph } from './../graph/model/graph.model';
import { ItemActions } from '../../../../core/actions/item.actions';

@Component({
    selector: 'cr-popup',
    templateUrl: './popup.html',
    styleUrls: ['./popup.css']
})
export class PopupDialogComponent implements OnInit {
    @ViewChild(GraphComponent)
    public graphComponent: GraphComponent;
    @ViewChild('contentContainer')
    public contentContainer: any;
    @select((s: IAppState) => s.core.selectedItem)
    readonly item$: Observable<Item>;
    @select((s: IAppState) => s.core.groupToFilterBy)
    readonly group$: Observable<Group>;

    constructor(
        private itemActions: ItemActions,
        private ngRedux: NgRedux<IAppState>
    ) {}

    public onNoClick(): void {
        this.itemActions.deselectItemExtended();
    }

    public ngOnInit(): void {
        this.graphComponent.width = this.contentContainer.nativeElement.offsetWidth - 50;
        this.graphComponent.height = this.contentContainer.nativeElement.offsetHeight - 20;
        this.graphComponent.miniMode = false;
        const store = this.ngRedux.getState().core;
        this.graphComponent.data = new Graph({
            items: store.items,
            acceptedItem: store.acceptedItems,
            targetItem: store.selectedItem,
            filterItemIds: store.itemsToFilterBy.map(x => x.id)
        });
    }

}
