import { find } from 'tslint/lib/utils';
import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { IAppState } from '../../app.store';
import { Item } from '../models/item.model';
import { ItemTypeEnum } from '../enums/item-type.enum';
import { FilteredItem } from '../models/filtered-item.model';
import { Group } from '../models/group.model';
import { AcceptedItem } from '../models/accepted-item.model';

@Injectable()
export class ItemHelper {

    constructor(
        private ngRedux: NgRedux<IAppState>
    ) {}

    isAccepted(item: Item) {
        let result = false;
        const store = this.ngRedux.getState().core;
        _.forEach(store.acceptedItems, x => {
            if (x.path.includes(item.id)) {
                result = true;
            }
        });

        return result;
    }

    findPurposeItemsAvailable(acceptedItems: AcceptedItem[]) {
        const allPurposeItems = this.ngRedux.getState().core.items.filter(x => x.type === ItemTypeEnum.Purpose);
        const acceptedPurposeItems = this.findPurposeItemsAccepted(acceptedItems);
        return _.difference(allPurposeItems, acceptedPurposeItems);
    }

    findPurposeItemsAccepted(acceptedItems: AcceptedItem[]) {
        const itemIds = _.uniq(_.flatten(_.map(acceptedItems, x => x.path)));
        const items = this.findByIds(itemIds);
        return _.filter(items, x => x.type === ItemTypeEnum.Purpose);
    }

    findByIds(ids: string[]) {
        const store = this.ngRedux.getState().core;
        return _.filter(store.items, x => ids.indexOf(x.id) > -1);
    }

    findById(id: string) {
        const store = this.ngRedux.getState().core;
        return _.find(store.items, x => x.id === id);
    }

    filterItemsByGroup(itemType: ItemTypeEnum): FilteredItem[] {
        const store = this.ngRedux.getState().core;
        const items = _.filter(store.items, x => x.type === itemType);
        const acceptedPaths = store.acceptedItems.map(x => x.path);

        const result: FilteredItem[] = [];
        _.forEach(items, item => {
            const filteredItem = new FilteredItem({id: item.id, name: item.name});
            const itemPaths = this.buildPath(store.items, item);
            const matchedPathCounter = this.matchPaths(itemPaths, acceptedPaths).length;
            filteredItem.isAccepted = itemPaths.length === matchedPathCounter;
            filteredItem.isIndeterminate = matchedPathCounter > 0 && matchedPathCounter < itemPaths.length;
            filteredItem.connections = this.extractConnectionTypes(itemPaths);

            result.push(filteredItem);
        });

        return result;
    }

    filterItemsByGroupByItems(groupToFilterBy: ItemTypeEnum, itemIdsToFilterBy: string[]): FilteredItem[] {
        const store = this.ngRedux.getState().core;
        const items = _.filter(store.items, x => x.type === groupToFilterBy);
        const acceptedPaths = store.acceptedItems.map(x => x.path);

        const result: FilteredItem[] = [];
        _.forEach(items, item => {
            const filteredItem = new FilteredItem({id: item.id, name: item.name});
            const itemPaths = this.buildPathByFilter(store.items, item, itemIdsToFilterBy);
            if (itemIdsToFilterBy.length === 0 || this.isInPath(itemPaths, itemIdsToFilterBy)) {
                const matchedPathCounter = this.matchPaths(itemPaths, acceptedPaths).length;
                filteredItem.isAccepted = itemPaths.length === matchedPathCounter;
                filteredItem.isIndeterminate = matchedPathCounter > 0 && matchedPathCounter < itemPaths.length;
                filteredItem.connections = this.extractConnectionTypes(itemPaths);

                result.push(filteredItem);
            }
        });

        return result;
    }

    buildPath2(item: Item): string[][] {
        const store = this.ngRedux.getState().core;

        return this.buildPath(store.items, item);
    }

    private isInPath(itemPaths: string[][], itemIds: string[]) {
        let result = false;
        _.forEach(itemPaths, path => {
            const intersectedItems = _.intersection(path, itemIds);
            if (_.isEqual(intersectedItems.sort(), itemIds.sort())) {
                result = true;
            }
        });

        return result;
    }

    private extractConnectionTypes(paths: string[][]): ItemTypeEnum[] {
        const store = this.ngRedux.getState().core;

        let longestPath = paths[0];
        paths.forEach(x => {
            if (x.length > longestPath.length) {
                longestPath = x;
            }
        });

        return longestPath.map(x => this.findItemById(store.items, x).type);
    }

    private matchPaths(currentPaths: string[][], acceptedPaths: string[][]): string[][] {
        const result = [];
        currentPaths.forEach(currentPath => {
            acceptedPaths.forEach(acceptedPath => {
                if (_.isEqual(currentPath, acceptedPath)) {
                    result.push([...acceptedPath]);
                    return;
                }
            });
        });

        return result;
    }

    private buildPathByFilter(items: Item[], item: Item, filterItemIds: string[]): string[][] {
        const paths = this.buildPath(items, item);
        const result = [];
        _.forEach(paths, path => {
            const intersectedItems = _.intersection(path, filterItemIds);
            if (_.isEqual(intersectedItems.sort(), filterItemIds.sort())) {
                result.push(path);
            }
        });

        return result;
    }

    private buildPath(items: Item[], item: Item): string[][] {
        const children = {list: [], path: []};
        this.findPathForChildren(items, item, children);
        const parents = {list: [], path: []};
        this.findPathForParents(items, item, parents);

        const result = [];
        children.list.forEach(x => {
            parents.list.forEach(y => {
                result.push(_.uniq(y.concat(x)));
            });
        });

        return result;
    }

    private findPathForChildren(items: Item[], item: Item, result: any): void {
        if (!result.path) {
            result.path = [];
            result.list = [];
        }

        const last: Item = _.last(result.path);
        if (!last || _.includes(item.parentIds, last.id)) {
            result.path.push(item);
        } else {
            const reversePath = _.reverse(result.path);
            let lastParent = null;
            reversePath.forEach(x => {
                if (_.includes(item.parentIds, x.id)) {
                    lastParent = x;
                    return;
                }
            });

            _.reverse(result.path);
            result.path = _.slice(result.path, 0, _.indexOf(result.path, lastParent) + 1);
            result.path.push(item);
        }

        const children = this.findItemsByParentId(items, item);
        _.each(children, x => {
            this.findPathForChildren(items, x, result);
        });

        const path = result.path.map(x => x.id);
        let pathCommited = false;
        result.list.forEach(x => {
            if (_.isEqual(x, path)) {
                pathCommited = true;
                return;
            }
        });

        if (!pathCommited) {
            result.list.push(path);
        }
    }

    private findPathForParents(items: Item[], item: Item, result: any): void {
        if (!result.path) {
            result.path = [];
            result.list = [];
        }

        const last: Item = _.last(result.path);
        const children = this.findItemsByParentId(items, item);
        if (!last || _.includes(children, last)) {
            result.path.push(item);
        } else {
            const reversePath = _.reverse(result.path);
            let lastChild = null;
            reversePath.forEach(x => {
                if (_.includes(children, x)) {
                    lastChild = x;
                    return;
                }
            });

            _.reverse(result.path);
            result.path = _.slice(result.path, 0, _.indexOf(result.path, lastChild) + 1);
            result.path.push(item);
        }

        let parents = [];
        if (item.parentIds) {
            parents = item.parentIds.map(x => this.findItemById(items, x));
        }
        _.each(parents, x => {
            this.findPathForParents(items, x, result);
        });

        const path = _.reverse(result.path.map(x => x.id));
        let pathCommited = false;
        result.list.forEach(x => {
            if (_.isEqual(x, path)) {
                pathCommited = true;
                return;
            }
        });

        if (!pathCommited) {
            result.list.push(path);
        }
    }

    private findItemsByParentId(items: Item[], item: Item): Item[] {
        const result: Item[] = [];
        _.each(items, x => {
            if (_.includes(x.parentIds, item.id)) {
                result.push(x);
            }
        });

        return result;
    }

    public findItemById(items: Item[], itemId: string): Item {
        return _.find(items, x => x.id === itemId);
    }

    public findGroupById(id: string): Group {
        const store = this.ngRedux.getState().core;

        return _.find(store.groups, x => x.id === id);
    }

}
