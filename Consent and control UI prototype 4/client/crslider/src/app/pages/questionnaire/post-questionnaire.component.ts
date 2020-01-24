import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import { QuestionnaireItem } from 'src/app/models/questionnaire-item';
import { Subscription } from 'rxjs';
import { QuestionnaireService } from 'src/app/services/questionnaire.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-postquestionnaire',
    templateUrl: './post-questionnaire.component.html',
    styleUrls: ['./post-questionnaire.component.css']
})
export class PostQuestionnaireComponent implements OnInit, OnDestroy  {
    studentIdFormGroup: FormGroup;

    yesno1: FormGroup;
    yesno2: FormGroup;
    yesno3: FormGroup;
    yesno4: FormGroup;
    yesno5: FormGroup;
    yesno6: FormGroup;
    yesno7: FormGroup;
    yesno8: FormGroup;
    yesno9: FormGroup;
    yesno10: FormGroup;
    yesno11: FormGroup;

    sliderQuestion1: FormGroup;
    sliderQuestion2: FormGroup;
    sliderQuestion3: FormGroup;
    sliderQuestion4: FormGroup;
    sliderQuestion5: FormGroup;
    sliderQuestion6: FormGroup;
    sliderQuestion7: FormGroup;
    sliderQuestion8: FormGroup;
    sliderQuestion9: FormGroup;
    sliderQuestion10: FormGroup;

    howUsefullGraph: FormGroup;
    howUsefullGraphIcon: FormGroup;
    howUsefullColorcoding: FormGroup;

    agreeingToProcessed: FormGroup;
    satisfiedConsentRequest: FormGroup;
    recommendConsentRequest: FormGroup;
    impressionTimeToComplete: FormGroup;
    concentMeetsNeeds: FormGroup;
    usefulTreeGraph: FormGroup;
    understandableTreeGraph: FormGroup;
    mostAppealing: FormGroup;
    hardestPart: FormGroup;
    surprisingUnexpected: FormGroup;
    toImproveConsent: FormGroup;
    howEasyUse: FormGroup;
    featureImportantMost: FormGroup;
    featureImportantLeast: FormGroup;
    keepUsing: FormGroup;
    especiallyInteresting: FormGroup;
    wordsDescribe: FormGroup;
    forWhatPurpose: FormGroup;
    howDataStored: FormGroup;
    what3rdPartyToShare: FormGroup;
    easiestPart: FormGroup;
    improveTreeGraph: FormGroup;
    improveFuncTreeGraph: FormGroup;
    usefulIconsTreeGraph: FormGroup;
    usefulColorCoding: FormGroup;
    doyoFeelProc: FormGroup;
    howRememberGraph: FormGroup;

    private formMap: Map<string, FormGroup> = new Map();
    private subscription: Subscription;
    private questionnaireItems: QuestionnaireItem[] = [];

    code = '';

    constructor(
      private route: ActivatedRoute,
        private cookieService: CookieService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private questionnaireService: QuestionnaireService) {
            this.agreeingToProcessed = this._formBuilder.group({
                purpose: ['', Validators.required],
                data: ['', Validators.required],
                storage: ['', Validators.required],
                processing: ['', Validators.required],
                sharing: ['', Validators.required]
            });
            this.formMap.set('agreeingToProcessed', this.agreeingToProcessed);

            this.studentIdFormGroup = this.createFormGroup('studentId');

            this.yesno1 = this.createFormGroup('yesno1');
            this.yesno2 = this.createFormGroup('yesno2');
            this.yesno3 = this.createFormGroup('yesno3');
            this.yesno4 = this.createFormGroup('yesno4');
            this.yesno5 = this.createFormGroup('yesno5');
            this.yesno6 = this.createFormGroup('yesno6');
            this.yesno7 = this.createFormGroup('yesno7');
            this.yesno8 = this.createFormGroup('yesno8');
            this.yesno9 = this.createFormGroup('yesno9');
            this.yesno10 = this.createFormGroup('yesno10');
            this.yesno11 = this.createFormGroup('yesno11');

            this.sliderQuestion1 = this.createFormGroup('sliderQuestion1');
            this.sliderQuestion2 = this.createFormGroup('sliderQuestion2');
            this.sliderQuestion3 = this.createFormGroup('sliderQuestion3');
            this.sliderQuestion4 = this.createFormGroup('sliderQuestion4');
            this.sliderQuestion5 = this.createFormGroup('sliderQuestion5');
            this.sliderQuestion6 = this.createFormGroup('sliderQuestion6');
            this.sliderQuestion7 = this.createFormGroup('sliderQuestion7');
            this.sliderQuestion8 = this.createFormGroup('sliderQuestion8');
            this.sliderQuestion9 = this.createFormGroup('sliderQuestion9');
            this.sliderQuestion10 = this.createFormGroup('sliderQuestion10');


            this.howUsefullGraph = this.createFormGroup('howUsefullGraph');
            this.howUsefullGraphIcon = this.createFormGroup('howUsefullGraphIcon');
            this.howUsefullColorcoding = this.createFormGroup('howUsefullColorcoding');
            this.howRememberGraph = this.createFormGroup('howRememberGraph');

            this.improveTreeGraph = this.createFormGroup('improveTreeGraph');
            this.improveFuncTreeGraph = this.createFormGroup('improveFuncTreeGraph');
            this.satisfiedConsentRequest = this.createFormGroup('satisfiedConsentRequest');
            this.easiestPart = this.createFormGroup('easiestPart');
            this.recommendConsentRequest = this.createFormGroup('recommendConsentRequest');
            this.doyoFeelProc = this.createFormGroup('doyoFeelProc');
            this.impressionTimeToComplete = this.createFormGroup('impressionTimeToComplete');
            this.concentMeetsNeeds = this.createFormGroup('concentMeetsNeeds');
            this.usefulTreeGraph = this.createFormGroup('usefulTreeGraph');
            this.usefulIconsTreeGraph = this.createFormGroup('usefulIconsTreeGraph');
            this.usefulColorCoding = this.createFormGroup('usefulColorCoding');
            this.understandableTreeGraph = this.createFormGroup('understandableTreeGraph');
            this.mostAppealing = this.createFormGroup('mostAppealing');
            this.hardestPart = this.createFormGroup('hardestPart');
            this.surprisingUnexpected = this.createFormGroup('surprisingUnexpected');
            this.toImproveConsent = this.createFormGroup('toImproveConsent');
            this.howEasyUse = this.createFormGroup('howEasyUse');
            this.featureImportantMost = this.createFormGroup('featureImportantMost');
            this.featureImportantLeast = this.createFormGroup('featureImportantLeast');
            this.keepUsing = this.createFormGroup('keepUsing');
            this.especiallyInteresting = this.createFormGroup('especiallyInteresting');
            this.forWhatPurpose = this.createFormGroup('forWhatPurpose');
            this.howDataStored = this.createFormGroup('howDataStored');
            this.what3rdPartyToShare = this.createFormGroup('what3rdPartyToShare');


            this.wordsDescribe = this._formBuilder.group({
                annoying: [''],
                appealing: [''],
                boring: [''],
                clear: [''],
                compelling: [''],
                complex: [''],
                confusing: [''],
                cuttingEdge: [''],
                dated: [''],
                difficult: [''],
                disruptive: [''],
                distracting: [''],
                dull: [''],
                easyToUse: [''],
                effective: [''],
                efficient: [''],
                effortless: [''],
                empowering: [''],
                engaging: [''],
                exceptional: [''],
                familiar: [''],
                fast: [''],
                flexible: [''],
                fresh: [''],
                friendly: [''],
                frustrating: [''],
                getsInTheWay: [''],
                hardToUse: [''],
                Helpful: [''],
                highQuality: [''],
                impressive: [''],
                ineffective: [''],
                innovative: [''],
                inspiring: [''],
                intimidating: [''],
                intuitive: [''],
                inviting: [''],
                irrelevant: [''],
                old: [''],
                ordinary: [''],
                organized: [''],
                overwhelming: [''],
                patronizing: [''],
                poorQuality: [''],
                powerful: [''],
                responsive: [''],
                rigid: [''],
                satisfying: [''],
                slow: [''],
                timeConsuming: [''],
                timeSaving: [''],
                tooTechnical: [''],
                unapproachable: [''],
                unattractive: [''],
                uncontrollable: [''],
                understandable: [''],
                undesirable: [''],
                unpredictable: [''],
                usable: [''],
                useful: [''],
                valuable: ['']
            });

            this.formMap.set('wordsDescribe', this.wordsDescribe);
        }


    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.code = params.get('code');
      });

        this.loadData();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onComplete() {
        this.saveData();
        this.router.navigate(['demographic-data', this.code]);
    }

    onNext() {
        this.saveData();
    }

    private createFormGroup(name: string) {
      const formGroup = this._formBuilder.group({ value: ['', Validators.required] });
      this.formMap.set(name, formGroup);

      return formGroup;
    }

    private loadData() {
        this.subscription = this.questionnaireService.loadQuestionnaire('questionn').subscribe(items => {
            this.questionnaireItems = items;
            items.forEach(x => {
                if (this.formMap.has(x.questionCode)) {
                    this.formMap.get(x.questionCode).setValue(JSON.parse(x.answer));
                }
            });

            this.subscription.unsubscribe();
        });
    }

    private saveData() {
        const itemsToSave: QuestionnaireItem[] = [];
        this.formMap.forEach((value, key) => {
            let toSave = _.find(this.questionnaireItems, (x) => x.questionCode === key);
            if (!toSave) {
                toSave = new QuestionnaireItem({questionCode: key, code: 'questionn', userUid: this.cookieService.get('user_uid')});
                this.questionnaireItems.push(toSave);
            }

            toSave.answer = JSON.stringify(value.value);

            itemsToSave.push(toSave);
        });

        this.questionnaireService.saveQuestionnaire(itemsToSave);
    }
}
