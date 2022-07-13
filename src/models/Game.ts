export class Game {
    questions: string[];
    questionTimeout: number;
    finishes: boolean[];
    results: boolean[];

    currQuestionId: number;

    constructor(questions: string[], questionTimeout: number) {
        this.questions = questions;
        this.questionTimeout = questionTimeout;
        this.finishes = new Array<boolean>(questions.length).fill(false);
        this.results = new Array<boolean>(questions.length).fill(false);
        this.currQuestionId = 0;
    }

    currQuestionFinish() {
        return this.finishes[this.currQuestionId];
    }

    setCurrQuestionFinish() {
        this.finishes[this.currQuestionId] = true;
    }

    currQuestion() {
        return this.questions[this.currQuestionId];
    }

    setCurrResult(success: boolean) {
        this.results[this.currQuestionId] = success;
    }

    setNextQuestion() {
        if (this.currQuestionId < this.questions.length - 1) {
            this.currQuestionId++;
        }
    }

    ended() {
        return this.finishes.reduce((prev, curr) => prev && curr, true);
    }

    score() {
        return Math.round(this.results.reduce((prev, curr) => prev + (curr ? 1 : 0), 0) * 100.0 / this.results.length);
    }
}
