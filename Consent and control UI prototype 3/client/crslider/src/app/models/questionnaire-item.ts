export class QuestionnaireItem {
    id: number;
    code: string;
    userUid: string;
    questionCode: string;
    answer: any;

    constructor(init?: Partial<QuestionnaireItem>) {
        Object.assign(this, init);
    }
}
