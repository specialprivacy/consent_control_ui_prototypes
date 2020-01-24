import { tassign } from 'tassign';

import { AppActions } from './actions/app.actions';
import { GroupActions } from './actions/group.actions';
import { AcceptedItem } from './models/accepted-item.model';
import { Group } from './models/group.model';
import { Item } from './models/item.model';
import { FilteredItem } from './models/filtered-item.model';
import { ItemActions } from './actions/item.actions';
import { FilterActions } from './actions/filter.actions';
import { OptionalPath } from './models/optional-path.model';
import { OptionalPathActions } from './actions/optional-path.actions';

export interface ICoreState {
    mode: string;
    isPending: boolean;
    groups: Group[];
    items: Item[];
    optionalPaths: OptionalPath[];
    selectedOptionalPaths: OptionalPath[];
    acceptedItems: AcceptedItem[];
    filteredItems: FilteredItem[];
    selectedItem: Item;
    selectedItemToExpand: Item;
    itemsToFilterBy: Item[];
    groupToFilterBy: Group;
}

export const CORE_INITIAL_STATE: ICoreState = {
    mode: 'builder',
    isPending: false,
    groups: [],
    items: [],
    optionalPaths: [],
    acceptedItems: [],
    filteredItems: [],
    selectedOptionalPaths: [],
    selectedItem: null,
    selectedItemToExpand: null,
    itemsToFilterBy: [],
    groupToFilterBy: null
};

export function coreReducer(state: ICoreState = CORE_INITIAL_STATE, action): ICoreState {
    switch (action.type) {
        case AppActions.LOAD_INITIAL_DATA_SUCCESS:
            return tassign(state, {
                isPending: false,
                groups: [...action.payload.groups],
                items: [...action.payload.items],
                acceptedItems: [...action.payload.acceptedItems],
                optionalPaths: [...action.payload.optionalPaths]
                // selectedItem: action.payload.items[0]
            });
        case ItemActions.LOAD_ACCEPT_ITEM_SUCCESS:
            return tassign(state, {
                isPending: false,
                acceptedItems: [...action.payload]
            });
        case ItemActions.ACCEPT_ITEM:
            return tassign(state, {
                isPending: true
            });
        case ItemActions.ACCEPT_ITEM_SUCCESS:
            return tassign(state, {
                isPending: false,
                selectedOptionalPaths: []
            });
        case ItemActions.SELECT_ITEM:
            return tassign(state, {
                selectedOptionalPaths: [],
                selectedItem: state.items.find(x => x.id === action.payload)
            });
        case ItemActions.SELECT_ITEM_EXTENDED:
            return tassign(state, {
                selectedItemToExpand: state.selectedItem
            });
        case ItemActions.DESELECT_ITEM_EXTENDED:
            return tassign(state, {
                selectedItemToExpand: null
            });
        case FilterActions.SET_GROUP_FILTER_SUCCESS:
            return tassign(state, {
                filteredItems: [...action.payload.filteredItems],
                groupToFilterBy: state.groups.find(x => x.id === action.payload.groupId),
                itemsToFilterBy: [],
                selectedItem: state.items.find(x => x.id === action.payload.filteredItems[0].id)
            });
        case FilterActions.SLICE_FILTER_TO_ITEM_SUCCESS:
            return tassign(state, {
                filteredItems: [...action.payload.filteredItems],
                groupToFilterBy: state.groups.find(x => x.id === action.payload.groupIdToFilterBy),
                itemsToFilterBy: state.items.filter(x => action.payload.itemIdsToFilterBy.includes(x.id)),
                selectedItem: state.items.find(x => x.id === action.payload.item.id)
            });
        case FilterActions.SET_GROUP_AND_ADD_ITEM_FILTER_SUCCESS:
            return tassign(state, {
                filteredItems: [...action.payload.filteredItems],
                groupToFilterBy: state.groups.find(x => x.id === action.payload.groupIdToFilterBy),
                itemsToFilterBy: state.items.filter(x => action.payload.itemIdsToFilterBy.includes(x.id)),
                selectedItem: state.items.find(x => x.id === action.payload.filteredItems[0].id)
            });
        case OptionalPathActions.DESELECT_OPTIONAL_PATH_SUCCESS:
        case OptionalPathActions.SELECT_OPTIONAL_PATH_SUCCESS:
            return tassign(state, {
                selectedOptionalPaths: [...action.payload]
            });
    }

    return state;
}
