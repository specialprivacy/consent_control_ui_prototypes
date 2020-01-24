export class PathItem {
    id: string;
    name: string;
    icon: string;

    constructor(init?: Partial<PathItem>) {
        Object.assign(this, init);
    }
}
