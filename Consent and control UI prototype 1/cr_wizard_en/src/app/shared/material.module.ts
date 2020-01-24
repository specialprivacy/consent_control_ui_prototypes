import { NgModule } from '@angular/core';

import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatCommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatRadioModule,
    MatStepperModule,
    MatTableModule,
    MatTooltipModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
} from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatListModule,
        MatTableModule,
        MatTooltipModule,
        MatCardModule,
        MatGridListModule,
        MatCommonModule,
        MatDialogModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatIconModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatProgressBarModule
    ],
    exports: [
        MatButtonModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatListModule,
        MatTableModule,
        MatTooltipModule,
        MatCardModule,
        MatGridListModule,
        MatCommonModule,
        MatDialogModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatIconModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatProgressBarModule
    ]
})
export class MaterialModule { }
