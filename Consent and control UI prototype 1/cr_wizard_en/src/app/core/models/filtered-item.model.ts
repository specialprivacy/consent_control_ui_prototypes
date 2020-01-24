import { ItemTypeEnum } from '../enums/item-type.enum';

export class FilteredItem {
    id: string;
    name: string;
    isAccepted: boolean;
    isIndeterminate: boolean;
    connections: ItemTypeEnum[];

    constructor(init?: Partial<FilteredItem>) {
        Object.assign(this, init);
    }
}
