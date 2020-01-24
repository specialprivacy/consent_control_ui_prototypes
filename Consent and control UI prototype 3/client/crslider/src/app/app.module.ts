import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatSliderModule, MatCardModule, MatListModule, MatCheckboxModule, MatBadgeModule, MatIconModule, MatSlideToggleModule, MatDividerModule, MatVerticalStepper, MatStepperModule, MatFormFieldModule, MatRadioModule, MatInputModule, MatGridListModule, MatTabsModule, MatTooltipModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Ng5SliderModule } from 'ng5-slider';
import { ConsentComponent } from './pages/consent/consent.component';

import { RouterModule, Routes } from '@angular/router';
import { PreQuestionnaireComponent } from './pages/questionnaire/pre-questionnaire.component';
import { PostQuestionnaireComponent } from './pages/questionnaire/post-questionnaire.component';
import { QuestionnaireService } from './services/questionnaire.service';

import { CookieService } from 'ngx-cookie-service';
import { HelpComponent } from './pages/help/help.component';
import { IntroComponent } from './pages/intro/intro.component';
import { ThankYouComponent } from './pages/thankyou/thank-you.component';
import { GraphComponent } from './pages/consent/graph/graph.component';

const appRoutes: Routes = [
  { path: '', component: ConsentComponent },
  { path: 'demographic-data', component: PreQuestionnaireComponent },
  { path: 'questionnaire', component: PostQuestionnaireComponent },
  { path: 'help', component: HelpComponent },
  { path: 'intro', component: IntroComponent },
  { path: 'thank-you', component: ThankYouComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ConsentComponent,
    PreQuestionnaireComponent,
    PostQuestionnaireComponent,
    HelpComponent,
    IntroComponent,
    ThankYouComponent,
    GraphComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSliderModule,
    MatCardModule,
    FormsModule,
    MatListModule,
    ScrollingModule,
    Ng5SliderModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatStepperModule,
    MatFormFieldModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatInputModule,
    MatGridListModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule
  ],
  providers: [
    CookieService,
    QuestionnaireService
  ],
  bootstrap: [AppComponent],
  entryComponents: [GraphComponent]
})
export class AppModule { }
