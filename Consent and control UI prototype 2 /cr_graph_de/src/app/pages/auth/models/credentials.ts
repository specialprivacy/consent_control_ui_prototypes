export class Credentials {
    username: string;
    password: string;

    constructor(init?: Partial<Credentials>) {
        Object.assign(this, init);
    }
}
