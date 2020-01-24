import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'cr-info-dialog',
    templateUrl: './info-dialog.component.html',
    styleUrls: ['./info-dialog.component.css']
})
export class InfoDialog2Component implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<InfoDialog2Component>,
        @Inject(MAT_DIALOG_DATA) public data: { text: string }
    ) { }

    ngOnInit() {
    }

    onOkClick() {
        this.dialogRef.close();
    }

}
