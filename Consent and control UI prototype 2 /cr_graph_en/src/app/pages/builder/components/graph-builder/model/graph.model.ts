import { Item } from '../../../../../core/models/item.model';
import { AcceptedItem } from '../../../../../core/models/accepted-item.model';
import { OptionalPath } from '../../../../../core/models/optional-path.model';

export class Graph {
    items: Item[];
    acceptedItem: AcceptedItem[];
    optionalPaths: OptionalPath[];
    targetItem: Item;
    filterItemIds: string[];

    constructor(init?: Partial<Graph>) {
        Object.assign(this, init);
    }
}
