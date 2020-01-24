export class OptionalPath {
    id: number;
    path: string[];

    constructor(init?: Partial<OptionalPath>) {
        Object.assign(this, init);
    }
}
