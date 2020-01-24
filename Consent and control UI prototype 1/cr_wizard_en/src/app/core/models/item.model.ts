import { ItemTypeEnum } from '../enums/item-type.enum';
import { IconHelper } from '../helpers/icon.helper';
import { AuditableRecord } from './audit/auditable-record';

export class Item extends AuditableRecord {
    id: string;
    type: ItemTypeEnum;
    name: string;
    parentIds: string[] = [];
    icon: string;

    constructor(init?: Partial<Item>) {
        super();
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
