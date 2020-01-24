import { Item } from './item.model';

export class Graph {
    items: Item[];
    targetItem: Item;

    constructor(init?: Partial<Graph>) {
        Object.assign(this, init);
    }
}
