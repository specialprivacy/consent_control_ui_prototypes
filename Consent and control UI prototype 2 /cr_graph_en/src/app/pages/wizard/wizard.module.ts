import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../../shared/material.module';
import { QuestionnaireService } from '../../shared/service/questionnaire.service';
import { AuthGuard } from '../auth/services/auth-guard.service';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { DescriptionComponent } from './components/description/description.component';
import { GraphComponent } from './components/graph/graph.component';
import { PopupDialogComponent } from './components/popup/popup';
import { RequestComponent } from './components/request/request.component';
import { SummaryDialogComponent } from './components/summary/summary.dialog.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { HelpComponent } from './pages/help/help.component';
import { IntroComponent } from './pages/intro/intro.component';
import { PostQuestionnaireComponent } from './pages/questionnaire/post-questionnaire.component';
import { PreQuestionnaireComponent } from './pages/questionnaire/pre-questionnaire.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { WizardComponent } from './pages/wizard/wizard.component';

@NgModule({
    imports: [
        // RouterModule.forRoot([
        //     { path: 'wizard', component: WizardComponent, canActivate: [AuthGuard] },
        //     { path: 'wizard/intro', component: IntroComponent, canActivate: [AuthGuard] },
        //     { path: 'wizard/help', component: HelpComponent, canActivate: [AuthGuard] },
        //     { path: 'wizard/post-questionnaire', component: PostQuestionnaireComponent, canActivate: [AuthGuard] },
        //     { path: 'wizard/demographic-data', component: PreQuestionnaireComponent, canActivate: [AuthGuard] },
        //     { path: 'wizard/thank-you', component: ThankYouComponent }
        // ]),
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BrowserModule,
        MaterialModule
    ],
    declarations: [
        WizardComponent,
        RequestComponent,
        GraphComponent,
        TabsComponent,
        DescriptionComponent,
        BreadcrumbComponent,
        PopupDialogComponent,
        IntroComponent,
        HelpComponent,
        PostQuestionnaireComponent,
        PreQuestionnaireComponent,
        ThankYouComponent,
        SummaryDialogComponent
    ],
    providers: [
        QuestionnaireService
    ],
    entryComponents: [
        PopupDialogComponent,
        SummaryDialogComponent
    ]
})
export class WizardModule {

}
