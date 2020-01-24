import { ItemTypeEnum } from '../enums/item-type.enum';
import { IconHelper } from '../helpers/icon.helper';

export class Group {
    id: string;
    type: ItemTypeEnum;
    name: string;
    description: string;
    videoUrl: string;
    icon: string;

    constructor(init?: Partial<Group>) {
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
