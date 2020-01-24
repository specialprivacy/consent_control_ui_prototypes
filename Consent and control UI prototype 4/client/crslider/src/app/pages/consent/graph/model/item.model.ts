import { ItemTypeEnum } from '../enums/item-type.enum';
import { IconHelper } from '../helpers/icon.helper';

export class Item {
    id: string;
    type: ItemTypeEnum;
    name: string;
    parentIds: string[] = [];
    icon: string;

    constructor(init?: Partial<Item>) {
        Object.assign(this, init);
    }

    parseJSON(data: any): Item {
        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.parentIds = data.parentIds;
        this.icon = IconHelper.getIcon(data.type);

        return this;
    }
}
