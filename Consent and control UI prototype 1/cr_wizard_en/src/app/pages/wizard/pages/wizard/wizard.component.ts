import { NgRedux } from '@angular-redux/store';
import { Component, OnInit, ViewChild } from '@angular/core';
import { selector } from 'rxjs/operator/publish';

import { IAppState } from '../../../../app.store';
import { GraphComponent } from '../../components/graph/graph.component';
import { Item } from '../../../../core/models/item.model';
import { Graph } from '../../components/graph/model/graph.model';
import { MatDialogRef, MatDialog } from '@angular/material';
import { PopupDialogComponent } from '../../components/popup/popup';
import { Router } from '@angular/router';
import { ItemActions } from '../../../../core/actions/item.actions';

import * as _ from 'lodash';
import { InfoDialogComponent } from '../../../../shared/components/dialogs/info.dialog.component';
import { SummaryDialogComponent } from '../../components/summary/summary.dialog.component';
import { AcceptedItem } from '../../../../core/models/accepted-item.model';

@Component({
    selector: 'cr-wizard',
    templateUrl: './wizard.component.html',
    styleUrls: ['./wizard.component.css']
})
export class WizardComponent {
    @ViewChild(GraphComponent)
    public graphComponent: GraphComponent;

    private dialogRef: MatDialogRef<PopupDialogComponent>;

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private dialog: MatDialog,
        private router: Router,
        private itemActions: ItemActions,
    ) {
        ngRedux.select<Item>((s: IAppState) => s.core.selectedItem).subscribe(items => this.showGraph());
        ngRedux.select<AcceptedItem[]>((s: IAppState) => s.core.acceptedItems).subscribe(items => this.showGraph());
        ngRedux.select<Item>((s: IAppState) => s.core.selectedItemToExpand).subscribe(x => this.showOrCloseExtendedGraph(x));
    }

    onHelpClick() {
        window.open('/wizard/help', '_blank');
    }

    onFinish() {
        const state = this.ngRedux.getState().core;
        if (_.isEmpty(state.acceptedItems)) {
            this.dialog.open(InfoDialogComponent);
        } else {
            const dialogRef = this.dialog.open(SummaryDialogComponent, {width: '95%'});
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.router.navigate(['wizard/post-questionnaire']);
                }
            });
        }
    }

    onExpandClick() {
        this.itemActions.selectItemExtended();
    }

    private showOrCloseExtendedGraph(item: Item) {
        if (item) {
            this.dialogRef = this.dialog.open(PopupDialogComponent, { width: '80%', height: '80%' });
        } else if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    private showGraph() {
        const store = this.ngRedux.getState().core;

        if (!this.graphComponent || !store.selectedItem) {
            return;
        }

        this.graphComponent.data = new Graph({
            items: store.items,
            acceptedItem: store.acceptedItems,
            targetItem: store.selectedItem,
            filterItemIds: store.itemsToFilterBy.map(x => x.id)
        });
    }

}

