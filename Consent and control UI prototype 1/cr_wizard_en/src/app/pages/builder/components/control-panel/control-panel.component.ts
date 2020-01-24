import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../../app.store';
import { Item } from '../../../../core/models/item.model';
import { ItemHelper } from '../../../../core/helpers/item.helper';
import { ItemActions } from '../../../../core/actions/item.actions';
import { AcceptedItem } from '../../../../core/models/accepted-item.model';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../../../shared/components/dialogs/confirm-dialog.component';
import { SummaryGraphComponent } from '../summary-graph/summary-graph.component';
import * as _ from 'lodash';
import { InfoDialog2Component } from '../../../../shared/components/dialogs/info-dialog/info-dialog.component';
import { InfoDialogComponent } from '../../../../shared/components/dialogs/info.dialog.component';
import { Router } from '@angular/router';

@Component({
    selector: 'cr-control-panel',
    templateUrl: './control-panel.component.html',
    styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {
    acceptedState: boolean = false;

    private selectedItemId: string;

    constructor(
        private itemHelper: ItemHelper,
        private itemActions: ItemActions,
        private ngRedux: NgRedux<IAppState>,
        private router: Router,
        private dialog: MatDialog
    ) {
        ngRedux.select<Item>((s: IAppState) => s.core.selectedItem).filter(x => x !== null).subscribe(item => this.updateStatus(item));
        ngRedux.select<AcceptedItem[]>((s: IAppState) => s.core.acceptedItems).subscribe(items => { this.updateStatusByAccepted(); });
    }

    ngOnInit() {
    }

    updateStatus(item: Item): any {
        this.selectedItemId = item.id;
        this.acceptedState = this.itemHelper.isAccepted(item);
    }

    updateStatusByAccepted() {
        if (!this.selectedItemId) {
            this.acceptedState = null;
        } else {
            this.acceptedState = this.itemHelper.isAccepted(this.itemHelper.findById(this.selectedItemId));
        }
    }

    onAcceptClick() {
        const store = this.ngRedux.getState().core;

        const item = this.itemHelper.findById(this.selectedItemId);
        const path = this.itemHelper.buildPath2(item);
        const optionalPaths = store.optionalPaths.map(x => x.path);
        let containsOptional = false;
        path.forEach(currentPath => {
            optionalPaths.forEach(optionalPath => {
                if (_.isEqual(_.intersection(currentPath, optionalPath), optionalPath)) {
                    containsOptional = true;
                }
            });
        });

        if (containsOptional && store.selectedOptionalPaths.length === 0) {
            this.dialog.open(InfoDialog2Component, {data: {text: 'Please select at least one optional item!'}});
        } else {
            this.itemActions.accept(this.selectedItemId);
        }
    }

    onSummaryClick() {
        this.dialog.open(SummaryGraphComponent);
    }

    onRevokeClick() {
        this.dialog.open(ConfirmDialogComponent, {data: {title: 'Warning', text: 'Are you sure you want to withdraw your consent? The corresponding functionality will not be available.'}})
            .afterClosed().filter(x => x === true).subscribe(x => {
                this.itemActions.revoke(this.selectedItemId);
            });
    }

    onFinish() {
        const state = this.ngRedux.getState().core;
        if (_.isEmpty(state.acceptedItems)) {
            this.dialog.open(InfoDialogComponent);
        } else {
            this.router.navigate(['builder/post-questionnaire']);
        }
    }
}
