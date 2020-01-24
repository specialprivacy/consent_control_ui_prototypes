import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../../shared/material.module';
import { AuthGuard } from '../auth/services/auth-guard.service';
import { AcceptedListComponent } from './components/accepted-list/accepted-list.component';
import { AvailableListComponent } from './components/available-list/available-list.component';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import { GraphBuilderComponent } from './components/graph-builder/graph-builder.component';
import { LegendComponent } from './components/graph-builder/legend/legend.component';
import { SummaryGraphComponent } from './components/summary-graph/summary-graph.component';
import { BuilderComponent } from './pages/builder/builder.component';
import { IntroComponent } from './pages/intro/intro.component';
import { HelpComponent } from './pages/help/help.component';
import { PostQuestionnaireComponent } from './pages/questionnaire/post-questionnaire.component';
import { PreQuestionnaireComponent } from './pages/questionnaire/pre-questionnaire.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        // RouterModule.forRoot([
        //     { path: 'builder', component: BuilderComponent, canActivate: [AuthGuard] },
        //     { path: 'builder/intro', component: IntroComponent, canActivate: [AuthGuard] },
        //     { path: 'builder/help', component: HelpComponent, canActivate: [AuthGuard] },
        //     { path: 'builder/post-questionnaire', component: PostQuestionnaireComponent, canActivate: [AuthGuard] },
        //     { path: 'builder/demographic-data', component: PreQuestionnaireComponent, canActivate: [AuthGuard] },
        //     { path: 'builder/thank-you', component: ThankYouComponent }
        // ]),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        FlexLayoutModule,
        CommonModule,
        BrowserModule
    ],
    declarations: [
        BuilderComponent,
        AvailableListComponent,
        AcceptedListComponent,
        ControlPanelComponent,
        GraphBuilderComponent,
        SummaryGraphComponent,
        LegendComponent,
        IntroComponent,
        HelpComponent,
        PostQuestionnaireComponent,
        PreQuestionnaireComponent,
        ThankYouComponent,
    ],
    entryComponents: [
        SummaryGraphComponent,
        LegendComponent
    ]
})
export class BuilderModule { }
