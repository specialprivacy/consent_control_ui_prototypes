import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'cr-info-dialog',
    template: `
            <h1 mat-dialog-title>Achtung!</h1>
            <div mat-dialog-content>
                Sie haben nicht zugestimmt Ihre Daten mit BeFit zu teilen.<br>BeFit kann Ihnen, also, keine der Dienste bereitstellen und Sie können das Gerät daher nicht verwenden.
            </div>
            <div mat-dialog-actions align="center">
                <button mat-raised-button (click)="onOkClick()" tabindex="-1">Ok</button>
            </div>
    `
})
export class InfoDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<InfoDialogComponent>
    ) {}

    public onOkClick(): void {
        this.dialogRef.close();
    }
}
