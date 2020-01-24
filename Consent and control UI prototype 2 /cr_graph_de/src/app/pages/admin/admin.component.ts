import { debounce } from 'rxjs/operator/debounce';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import * as FileSaver from 'file-saver';
import { QuestionnaireService } from '../../shared/service/questionnaire.service';
import { QuestionnaireItem } from '../../shared/model/questionnaire-item';

import * as crypto from 'crypto-js';
import { AppUser } from '../auth/models/app-user';
import { AuthService } from '../auth/services/auth.service';
import { Questionnaire } from './model/questionnaire';

@Component({
    selector: 'cr-admin',
    templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit, OnDestroy {
    users: AppUser[] = [];
    toIgnore: string = '';
    toDecode: string = '';

    private userSubscription: Subscription;
    private logSubscription: Subscription;

    constructor(
        private userService: AuthService,
        // private trackingService: TrackingService,
        private questionnaireService: QuestionnaireService
    ) {}

    ngOnInit() {}

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
        this.logSubscription.unsubscribe();
    }

    onUserClick(userd) {
        // const logSubscription = this.trackingService.loadLog(userd.$key).subscribe(x => {
        //     const logs = [];
        //     let currentLog = [];
        //     _.forEach(x, log => {
        //         if (log === 'RESTART') {
        //             logs.push([...currentLog]);
        //             currentLog = [];
        //         } else {
        //             currentLog.push(log);
        //         }
        //     });

        //     logs.push(currentLog);
        //     logs.shift();

        //     let counter = 0;
        //     _.forEach(logs, item => {
        //         this.saveSteps(item, ++counter, userd);
        //     });

        //     logSubscription.unsubscribe();
        // });

        let qstn = '';

        const qsn1 = this.questionnaireService.loadPreQuestionnaireByUserId(userd.uid).subscribe(x => {
            const questionnaire1: Questionnaire[] = [];
            questionnaire1.push(new Questionnaire('genderFormGroup', 'What is your gender?', ['Male', 'Female']));
            questionnaire1.push(new Questionnaire('ageFormGroup', 'What is your age?', ['less than 16 years old', '16-25 years old', '26-35 years old', '36-45 years old', '46-55 years old', '55 years and over']));
            questionnaire1.push(new Questionnaire('countryFromFormGroup', 'Which Country?', null));
            questionnaire1.push(new Questionnaire('educationFormGroup', 'What is the highest level of education you have completed?', ['Some high school, no diploma', 'High school graduate, diploma or the equivalent', 'Trade/technical/vocational training', 'Some college, no degree', 'Bachelor’s degree', 'Mater’s degree', 'Doctorate degree']));
            questionnaire1.push(new Questionnaire('professionalBackground', 'What is (or was) your field of studies?', ['Natural and Physical Sciences', 'Information Technology', 'Engineering and Related Technologies', 'Architecture and Building', 'Agriculture, Environment and Related Studies', 'Agriculture, Environment and Related Studies', 'Health', 'Education', 'Management and Commerce', 'Society and Culture', 'Creative Arts', 'Food, Hospitality and Personal Services']));
            questionnaire1.push(new Questionnaire('internetUsageAvg', 'On average, how many hours per day do you spend on the Internet?', ['Less than 1 hour a day', '1-3 hours', '3-6 hours', '6-8 hours', 'More than 8 hours a day']));
            questionnaire1.push(new Questionnaire('internetSatisfactio', 'How would you assess your current skills for using the Internet?', ['Novice', 'Advanced beginner', 'Competent', 'Proficient', 'Expert']));
            questionnaire1.push(new Questionnaire('comfortableComputer', 'How easy is it for you to use computers?', ['Very difficult', 'Somewhat difficult', 'Neither difficult nor easy', 'Somewhat easy', 'Very easy']));
            questionnaire1.push(new Questionnaire('device', 'What is your preferred device to browse the Internet?', ['Desktop computer', 'Laptop', 'Tablet', 'Smartphone']));

            qstn += this.saveAnswers(x, userd, questionnaire1, 'Questionnaire1');

            qsn1.unsubscribe();

            const qsn2 = this.questionnaireService.loadPostQuestionnaireByUserId(userd.uid).subscribe(y => {
                const questionnaire2: Questionnaire[] = [];
                questionnaire2.push(new Questionnaire('agreeingToProcessed', 'What do you remember agreeing to?', { data: 'Data', sharing: 'Sharing', storage: 'Storage', purpose: 'Purpose', processing: 'Processing' }));
                questionnaire2.push(new Questionnaire('satisfiedConsentRequest', 'Overall, how satisfied or dissatisfied are you with the consent request?', ['Very satisfied', 'Somewhat satisfied', 'Neither satisfied nor dissatisfied', 'Somewhat dissatisfied', 'Very dissatisfied']));
                questionnaire2.push(new Questionnaire('recommendConsentRequest', 'How likely is it that you would recommend the consent request to a friend?', ['Not at all likely', 'Slightly likely', 'Moderately likely', 'Very likely', 'Extremely likely']));
                questionnaire2.push(new Questionnaire('impressionTimeToComplete', 'What was you impression of the time it took you to complete the tasks?', ['Too long', 'Too long but it was worth while', 'About the right amount of time', 'It took less time than I thought it would']));
                questionnaire2.push(new Questionnaire('wordsDescribe', 'Which of the following words would you use to describe the consent request?',
                {
                    annoying: 'Annoying', appealing: 'Appealing', boring: 'Boring', clear: 'Clear', compelling: 'Compelling', complex: 'Complex', confusing: 'Confusing', cuttingEdge: 'Cutting edge', dated: 'Dated', difficult: 'Difficult',
                    disruptive: 'Disruptive', distracting: 'Distracting', dull: 'Dull', easyToUse: 'Easy to use', effective: 'Effective', efficient: 'Efficient', effortless: 'Effortless', empowering: 'Empowering', engaging: 'Engaging', exceptional: 'Exceptional',
                    familiar: 'Familiar', fast: 'Fast', flexible: 'Flexible', fresh: 'Fresh', friendly: 'Friendly', frustrating: 'Frustrating', getsInTheWay: 'Gets in the way', hardToUse: 'Hard to Use', Helpful: 'Helpful', highQuality: 'High quality',
                    impressive: 'Impressive', ineffective: 'Ineffective', innovative: 'Innovative', inspiring: 'Inspiring', intimidating: 'Intimidating', intuitive: 'Intuitive', inviting: 'Inviting', irrelevant: 'Irrelevant', old: 'Old', ordinary: 'Ordinary',
                    organized: 'Organized', overwhelming: 'Overwhelming', patronizing: 'Patronizing', poorQuality: 'Poor quality', powerful: 'Powerful', responsive: 'Responsive', rigid: 'Rigid', satisfying: 'Satisfying', slow: 'slow', timeConsuming: 'timeConsuming',
                    timeSaving: 'Time-Saving', tooTechnical: 'Too Technical', unapproachable: 'Unapproachable', unattractive: 'Unattractive', uncontrollable: 'Uncontrollable', understandable: 'Understandable', undesirable: 'Undesirable', unpredictable: 'Unpredictable', usable: 'Usable', useful: 'Useful', valuable: 'Valuable'
                }
                ));
                questionnaire2.push(new Questionnaire('concentMeetsNeeds', 'How well the consent request does meet your needs for privacy policy representation?', ['Extremely well', 'Very well', 'Somewhat well', 'Not so well', 'Not at all well']));
                questionnaire2.push(new Questionnaire('understandableTreeGraph', 'How understandable did you find the tree graph?', ['Not at all understandable', 'Slightly understandable', 'Moderately understandable', 'Very understandable', 'Extremely understandable']));
                questionnaire2.push(new Questionnaire('usefulTreeGraph', 'How useful did you find the tree graph?', ['Not at all useful', 'Slightly useful', 'Moderately useful', 'Very useful', 'Extremely useful']));
                questionnaire2.push(new Questionnaire('usefulIconsTreeGraph', 'How useful did you find the icons in the graph?', ['Not at all useful', 'Slightly useful', 'Moderately useful', 'Very useful', 'Extremely useful']));
                questionnaire2.push(new Questionnaire('usefulColorCoding', 'How useful did you find the color-coding of the data types?', ['Not at all useful', 'Slightly useful', 'Moderately useful', 'Very useful', 'Extremely useful']));
                questionnaire2.push(new Questionnaire('improveTreeGraph', 'What would you suggest to improve in the tree graph?', null));
                questionnaire2.push(new Questionnaire('improveFuncTreeGraph', 'What would you suggest to improve in the functionality graph?', null));
                questionnaire2.push(new Questionnaire('mostAppealing', 'What did you like most about the consent request in comparison to a traditional privacy policy?', null));
                questionnaire2.push(new Questionnaire('easiestPart', 'What’s the easiest part about using the consent request?', null));
                questionnaire2.push(new Questionnaire('hardestPart', 'What’s the hardest part about using the consent request?', null));
                questionnaire2.push(new Questionnaire('surprisingUnexpected', 'Was there anything surprising or unexpected about the consent request?', null));
                questionnaire2.push(new Questionnaire('toImproveConsent', 'What could be done to improve the consent request?', null));
                questionnaire2.push(new Questionnaire('howEasyUse', 'How easy is the consent request to use?', null));
                questionnaire2.push(new Questionnaire('doyoFeelProc', 'Do you feel that you control the processing of your data?', ['Strongly agree', 'Agree', 'Neither agree nor disagree', 'Disagree', 'Strongly disagree']));
                questionnaire2.push(new Questionnaire('featureImportantMost', 'Which feature (or features) of the consent request are most important to you?', null));
                questionnaire2.push(new Questionnaire('featureImportantLeast', 'Which feature (or features) of the consent request are least important to you?', null));
                questionnaire2.push(new Questionnaire('keepUsing', 'What might keep people from using the consent request?', null));
                questionnaire2.push(new Questionnaire('especiallyInteresting', 'What was especially interesting, what was not entirely clear, what will you remember from the second (usability testing) session? Why?', null));

                qstn += '\u000d\u000d';
                qstn += this.saveAnswers(y, userd, questionnaire2, 'Questionnaire2');

                qsn2.unsubscribe();

                const file = new File([qstn], `${this.getUserName(userd)}.txt`, {type: 'text/plain;charset=utf-8'});
                FileSaver.saveAs(file);
            });
        });
    }

    private saveAnswers(data: QuestionnaireItem[], user, questionnaires: Questionnaire[], header) {
        if (!data) {
            data = [];
        }
        let result = header + '\u000d';
        const questionnaireCodes = data.map(x => x.questionCode);
        questionnaires.forEach(x => {
            if (!questionnaireCodes.includes(x.questionId)) {
                return;
            }
            try {
                const savedAnswer = data.find(item => item.questionCode === x.questionId);
                let tmp = '';
                tmp += x.questionLabel + '\u000d';

                const answrs = savedAnswer.answer;
                if (x.answers instanceof Array) {
                    tmp += '    - ' + x.answers[parseInt(savedAnswer.answer.value, 10) - 1] + '\u000d';
                } else if (x.answers === null) {
                    tmp += '    - ' + savedAnswer.answer.value + '\u000d';
                } else if (x.questionId === 'wordsDescribe') {
                    tmp += '    - ';
                    _.forIn(savedAnswer.answer, (value, key) => {
                        if (value === true) {
                            tmp += '"' + x.answers[key] + '", ';
                        }
                    });
                    tmp += '\u000d';
                } else if (x.questionId === 'agreeingToProcessed') {
                    _.forIn(savedAnswer.answer, (value, key) => {
                        tmp += '    - ' + x.answers[key] + ': "' + value + '" \u000d';
                    });
                    tmp += '\u000d';
                }

                result += tmp;
            } catch (error) {}
        });

        return result;
    }

    onDownloadAllClick() {
        this.users.forEach(x => {
            this.onUserClick(x);
        });
    }

    // private saveSteps(data, counter, user) {
    //     if (!data[0].acceptedItems) {
    //         data[0].acceptedItems = [];
    //     }
    //     const result = {
    //         payload: JSON.stringify(data),
    //         preloadedState: '{"mode":"wizard","groups":[],"selectedGroup":null,"selectedItem":null,"acceptedItems":[],"selectedItemExpanded":null,"items":[],"filteredItems":[],"pathItems":[],"loginErrorMessage":null,"userId":null}'
    //     };
    //     const file = new File([JSON.stringify(result)], `${this.getUserName(user)}_${counter}.json`, {type: 'text/plain;charset=utf-8'});
    //     FileSaver.saveAs(file);
    // }

    onShowClick() {
        // this.userSubscription = this.userService.getAllUsers().subscribe(x => {
        //     this.userSubscription.unsubscribe();

        //     const usersc = _.filter(x, user => {
        //         const ignore = _.split(this.toIgnore, ',').map(userId => crypto.SHA256(userId.trim()).toString() + '@user-concent-request.com');

        //         return !_.includes(ignore, user.email);
        //     });

        //     usersc.forEach(usr => {
        //         (usr as any).nameString = this.getUserName(usr);
        //     });

        //     this.users = _.sortBy(usersc, y => y.date);
        // });
    }

    trackByFn(index, item) {
        return item.id;
    }

    getUserName(user) {
        const userIds = _.split(this.toDecode, ',').map(userId => userId.trim());

        let currentUserId = user.email.slice(0, user.email.indexOf('@'));
        userIds.forEach(x => {
            const emails = [];

            emails.push(this.createEmail(x));
            emails.push(this.createEmail(x + ' '));
            emails.push(this.createEmail(' ' + x));
            emails.push(this.createEmail(x + '1'));
            emails.push(this.createEmail(x + '2'));
            emails.push(this.createEmail(x + '3'));
            emails.push(this.createEmail(x.replace('h', '')));
            emails.push(this.createEmail(x.replace('h', ' ')));
            emails.push(this.createEmail(x.replace('h', '0')));
            emails.push(this.createEmail(x.replace('h', '00')));
            emails.push(this.createEmail(x.replace('h0', 'h')));
            emails.push(this.createEmail(x.replace('h0', 'h') + '1'));
            emails.push(this.createEmail(x.replace('h0', 'h') + '2'));
            emails.push(this.createEmail(x.replace('h0', 'h') + '3'));
            emails.push(this.createEmail(x.replace('h0', 'h') + '4'));
            emails.push(this.createEmail(x.replace('h0', 'h') + '5'));

            const foundEmail = emails.find(item => item.email === user.email);
            if (foundEmail) {
                currentUserId = foundEmail.id;
                return;
            }
        });

        return new Date(user.date).toISOString().split('.')[0] + '__' + currentUserId;
    }

    private createEmail(userId) {
        return {id: userId, email: crypto.SHA256(userId) + '@user-concent-request.com'};
    }
}
