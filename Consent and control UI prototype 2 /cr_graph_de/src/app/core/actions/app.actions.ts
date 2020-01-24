import { Injectable } from '@angular/core';

@Injectable()
export class AppActions {
    static LOAD_INITIAL_DATA = '[APP] LOAD_INITIAL_DATA';
    static LOAD_INITIAL_DATA_SUCCESS = '[APP] LOAD_INITIAL_DATA_SUCCESS';

    constructor() { }
}
