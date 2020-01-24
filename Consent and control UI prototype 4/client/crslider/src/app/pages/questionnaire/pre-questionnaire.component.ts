import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import { QuestionnaireItem } from 'src/app/models/questionnaire-item';
import { Subscription } from 'rxjs';
import { QuestionnaireService } from 'src/app/services/questionnaire.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-prequestionnaire',
    templateUrl: './pre-questionnaire.component.html',
    styleUrls: ['./pre-questionnaire.component.css']
})
export class PreQuestionnaireComponent implements OnInit, OnDestroy  {
    ageFormGroup: FormGroup;
    genderFormGroup: FormGroup;
    educationFormGroup: FormGroup;
    professionalBackground: FormGroup;
    internetUsageAvg: FormGroup;
    internetSatisfactio: FormGroup;
    comfortableComputer: FormGroup;
    device: FormGroup;
    countryFromFormGroup: FormGroup;

    private questionnaireItems: QuestionnaireItem[] = [];
    private formMap: Map<string, FormGroup> = new Map();
    private subscription: Subscription;

    code = '';

    constructor(
      private route: ActivatedRoute,
        private cookieService: CookieService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private questionnaireService: QuestionnaireService) {

        this.ageFormGroup = this.createFormGroup('ageFormGroup');
        this.genderFormGroup = this.createFormGroup('genderFormGroup');
        this.educationFormGroup = this.createFormGroup('educationFormGroup');
        this.professionalBackground = this.createFormGroup('professionalBackground');
        this.internetUsageAvg = this.createFormGroup('internetUsageAvg');
        this.internetSatisfactio = this.createFormGroup('internetSatisfactio');
        this.comfortableComputer = this.createFormGroup('comfortableComputer');
        this.device = this.createFormGroup('device');
        this.countryFromFormGroup = this.createFormGroup('countryFromFormGroup');
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
        this.router.navigate(['thank-you', this.code]);
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
        this.subscription = this.questionnaireService.loadQuestionnaire('demograph').subscribe(items => {
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
                toSave = new QuestionnaireItem({questionCode: key, code: 'demograph', userUid: this.cookieService.get('user_uid')});
                this.questionnaireItems.push(toSave);
            }

            toSave.answer = JSON.stringify(value.value);

            itemsToSave.push(toSave);
        });

        this.questionnaireService.saveQuestionnaire(itemsToSave);
    }

}
