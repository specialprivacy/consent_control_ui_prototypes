import { ItemTypeEnum } from '../enums/item-type.enum';
import { IconHelper } from '../helpers/icon.helper';
import { AuditableRecord } from './audit/auditable-record';

export class Group extends AuditableRecord {
    id: string;
    type: ItemTypeEnum;
    name: string;
    description: string;
    videoUrl: string;
    icon: string;

    constructor(init?: Partial<Group>) {
        super();
        Object.assign(this, init);
    }

    parseJSON(data: any): Group {
        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.description = data.description;
        this.videoUrl = data.videoUrl;
        this.icon = IconHelper.getIcon(data.type);

        return this;
    }
}
