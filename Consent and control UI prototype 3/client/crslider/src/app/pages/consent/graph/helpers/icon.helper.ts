import { ItemTypeEnum } from '../enums/item-type.enum';

export class IconHelper {

    static getIcon(itemType: ItemTypeEnum): string {
        switch (itemType) {
            case ItemTypeEnum.Data:
                return 'fa fa-id-card-o';
            case ItemTypeEnum.Purpose:
                return 'fa fa-bullseye';
            case ItemTypeEnum.Processing:
                return 'fa fa-retweet';
            case ItemTypeEnum.Storage:
                return 'fa fa-archive';
            case ItemTypeEnum.Sharing:
                return 'fa fa-share-alt';
        }

        return null;
    }

    static convertIconToUnicode(icon: string): string {
        switch (icon) {
            case 'fa fa-id-card-o':
                return '\uf2c3';
            case 'fa fa-bullseye':
                return '\uf140';
            case 'fa fa-retweet':
                return '\uf079';
            case 'fa fa-archive':
                return '\uf187';
            case 'fa fa-share-alt':
                return '\uf1e0';
        }

        return null;
    }
}
