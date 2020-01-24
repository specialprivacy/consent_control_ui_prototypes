import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';

import { ItemTypeEnum } from '../../core/enums/item-type.enum';
import { Group } from '../../core/models/group.model';
import { Item } from '../../core/models/item.model';
import * as _ from 'lodash';
@Injectable()
export class DataService {
    constructor(
        private db: AngularFireDatabase) {
    }

    generateData() {
        // _.forEach(this.generateItems(), x => { this.db.list('/items').push(x); });
        // _.forEach(this.generateGroups(), x => { this.db.list('/groups').push(x); });
    }

    private generateItems(): Item[] {
        return [
            new Item ({id: 'purpose_1', type: ItemTypeEnum.Purpose, name: 'Die Ruheherzfrequenz anzeigen'}),
            new Item ({id: 'purpose_2', type: ItemTypeEnum.Purpose, name: 'Gesamte Tagesherzfrequenz anzeigen'}),
            new Item ({id: 'purpose_3', type: ItemTypeEnum.Purpose, name: 'Die Route auf der Karte anzeigen'}),
            new Item ({id: 'purpose_4', type: ItemTypeEnum.Purpose, name: 'Punktweise Geschwindigkeit auf der Karte anzeigen'}),
            new Item ({id: 'purpose_5', type: ItemTypeEnum.Purpose, name: 'Rennzeitvorhersagen ableiten'}),
            new Item ({id: 'purpose_6', type: ItemTypeEnum.Purpose, name: 'Verbrennte Kalorien ableiten'}),
            new Item ({id: 'purpose_7', type: ItemTypeEnum.Purpose, name: 'Cardio(Herz)-Fitness Punkte ableiten'}),
            new Item ({id: 'purpose_9', type: ItemTypeEnum.Purpose, name: 'Einen Recovery-Berater aktivieren, um Ratschlaege zu bkommen, wann das naechste Training beginnen soll'}),
            new Item ({id: 'purpose_10', type: ItemTypeEnum.Purpose, name: 'Die Produkte und Dienstleistungen des Service-Providers verbessern'}),
            new Item ({id: 'purpose_11', type: ItemTypeEnum.Purpose, name: 'Gezielte Fitnesswerbung aktivieren'}),
            new Item ({id: 'purpose_12', type: ItemTypeEnum.Purpose, name: 'Daten sichern'}),

            new Item ({id: 'data_1', type: ItemTypeEnum.Data, name: 'Ruheherzfrequenz', parentIds: ['purpose_1', 'purpose_2']}),
            new Item ({id: 'data_2', type: ItemTypeEnum.Data, name: 'Aktivitaetherzfrequenz', parentIds: ['purpose_2', 'purpose_6', 'purpose_7', 'purpose_10']}),
            new Item ({id: 'data_3', type: ItemTypeEnum.Data, name: 'Schlafzeit', parentIds: ['purpose_5', 'purpose_10']}),
            new Item ({id: 'data_4', type: ItemTypeEnum.Data, name: 'Schritte', parentIds: ['purpose_5', 'purpose_6', 'purpose_9', 'purpose_10']}),
            new Item ({id: 'data_5', type: ItemTypeEnum.Data, name: 'Distaz', parentIds: ['purpose_10', 'purpose_9', 'purpose_6', 'purpose_5']}),
            new Item ({id: 'data_6', type: ItemTypeEnum.Data, name: 'GPS Koordinaten', parentIds: ['purpose_3', 'purpose_4', 'purpose_11', 'purpose_10']}),
            new Item ({id: 'data_7', type: ItemTypeEnum.Data, name: 'Alter', parentIds: ['purpose_7', 'purpose_10']}),
            new Item ({id: 'data_8', type: ItemTypeEnum.Data, name: 'Geschlecht', parentIds: ['purpose_10', 'purpose_9', 'purpose_7']}),
            new Item ({id: 'data_9', type: ItemTypeEnum.Data, name: 'Gewicht', parentIds: ['purpose_9', 'purpose_10', 'purpose_11', 'purpose_7']}),
            new Item ({id: 'data_10', type: ItemTypeEnum.Data, name: 'Aktivitaetsdauer', parentIds: ['purpose_12', 'purpose_11', 'purpose_10', 'purpose_9', 'purpose_6']}),

            new Item ({id: 'storage_1', type: ItemTypeEnum.Storage, name: 'Auf dem Geraet', parentIds: ['data_1', 'data_2', 'data_3', 'data_4']}),
            new Item ({id: 'storage_2', type: ItemTypeEnum.Storage, name: 'Auf den Infrastrukturen von Drittanbietern', parentIds: ['data_4', 'data_5', 'data_7', 'data_8', 'data_9', 'data_6', 'data_10']}),
            new Item ({id: 'storage_3', type: ItemTypeEnum.Storage, name: 'Auf den Infrastrukturen von BeFit', parentIds: ['data_5', 'data_7']}),

            new Item ({id: 'processing_1', type: ItemTypeEnum.Processing, name: 'Die Berechnungen auf dem Geraet', parentIds: ['storage_1']}),
            new Item ({id: 'processing_2', type: ItemTypeEnum.Processing, name: 'BeFit-Berechnungen', parentIds: ['storage_3']}),
            new Item ({id: 'processing_3', type: ItemTypeEnum.Processing, name: 'Google-Berechnungen', parentIds: ['sharing_1']}),
            new Item ({id: 'processing_4', type: ItemTypeEnum.Processing, name: 'Axiom-Berechnungen', parentIds: ['sharing_2']}),
            new Item ({id: 'processing_5', type: ItemTypeEnum.Processing, name: 'Dropbox-Berechnungen', parentIds: ['sharing_3']}),
            new Item ({id: 'processing_6', type: ItemTypeEnum.Processing, name: 'Runkeeper-Berechnungen', parentIds: ['sharing_4']}),

            new Item ({id: 'sharing_1', type: ItemTypeEnum.Sharing, name: 'Google', parentIds: ['storage_2']}),
            new Item ({id: 'sharing_2', type: ItemTypeEnum.Sharing, name: 'Axiom', parentIds: ['storage_2']}),
            new Item ({id: 'sharing_3', type: ItemTypeEnum.Sharing, name: 'Dropbox', parentIds: ['storage_2']}),
            new Item ({id: 'sharing_4', type: ItemTypeEnum.Sharing, name: 'Runkeeper', parentIds: ['storage_2']}),
        ];
    }

    private generateGroups(): Group[] {
        return [
            new Group ({
                id: 'purpose',
                type: ItemTypeEnum.Purpose,
                name: 'Purpose',
                videoUrl: 'https://www.youtube.com/embed/aVS4W7GZSq0',
                // tslint:disable-next-line:max-line-length
                description: 'We need to process your data to provide the following services:'
            }),
            new Group ({
                id: 'data',
                type: ItemTypeEnum.Data,
                name: 'Data',
                videoUrl: 'https://www.youtube.com/embed/aVS4W7GZSq0',
                // tslint:disable-next-line:max-line-length
                description: 'Depending on the functionality we may need to process one or more data categories:'
            }),
            new Group ({
                id: 'storage',
                type: ItemTypeEnum.Storage,
                name: 'Storage',
                videoUrl: 'https://www.youtube.com/embed/aVS4W7GZSq0',
                // tslint:disable-next-line:max-line-length
                description: 'Depending on the functionality we will store your data on:'
            }),
            new Group ({
                id: 'sharing',
                type: ItemTypeEnum.Sharing,
                name: 'Sharing',
                videoUrl: 'https://www.youtube.com/embed/aVS4W7GZSq0',
                // tslint:disable-next-line:max-line-length
                description: 'Depending on the functionality we may need to share your data with:'
            }),
            new Group ({
                id: 'processing',
                type: ItemTypeEnum.Processing,
                name: 'Processing',
                videoUrl: 'https://www.youtube.com/embed/aVS4W7GZSq0',
                // tslint:disable-next-line:max-line-length
                description: 'Depending on the functionality we will process your data in the following way:'
            }),
        ];
    }

}
