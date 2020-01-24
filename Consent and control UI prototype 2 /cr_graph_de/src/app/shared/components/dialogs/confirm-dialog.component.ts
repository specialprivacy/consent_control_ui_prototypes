import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'cr-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { text: string, title: string }
    ) { }

    ngOnInit() {
    }

}
