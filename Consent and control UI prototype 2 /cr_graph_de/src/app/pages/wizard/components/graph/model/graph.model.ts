


import { Item } from '../../../../../core/models/item.model';
import { AcceptedItem } from '../../../../../core/models/accepted-item.model';



export class Graph {
    items: Item[];
    acceptedItem: AcceptedItem[];
    targetItem: Item;
    filterItemIds: string[];

    constructor(init?: Partial<Graph>) {
        Object.assign(this, init);
    }
}
