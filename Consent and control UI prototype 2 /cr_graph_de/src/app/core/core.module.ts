import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppActions } from './actions/app.actions';
import { FilterActions } from './actions/filter.actions';
import { GroupActions } from './actions/group.actions';
import { ItemActions } from './actions/item.actions';
import { AppEpics } from './epics/app.epics';
import { GroupEpics } from './epics/group.epics';
import { ItemEpics } from './epics/item.epics';
import { ItemHelper } from './helpers/item.helper';
import { AcceptedItemService } from './services/accepted-item.service';
import { GroupService } from './services/group.service';
import { ItemService } from './services/item.service';
import { FilterEpics } from './epics/filter.epics';
import { OptionalPathActions } from './actions/optional-path.actions';
import { OptionalPathEpics } from './epics/optional-path.epics';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        GroupEpics,
        GroupService,
        GroupActions,
        ItemActions,
        OptionalPathActions,
        FilterActions,
        FilterEpics,
        OptionalPathEpics,
        ItemEpics,
        ItemService,
        AppActions,
        AppEpics,
        ItemHelper,
        AcceptedItemService
    ]
})
export class CoreModule {
    constructor() {

    }
}
