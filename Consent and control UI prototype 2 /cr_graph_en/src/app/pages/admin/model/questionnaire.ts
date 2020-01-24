export class Questionnaire {
    questionId: string;
    questionLabel: string;
    answers: any;

    constructor(questionId: string, questionLabel: string, answers: any) {
        this.questionId = questionId;
        this.questionLabel = questionLabel;
        this.answers = answers;
    }
}
