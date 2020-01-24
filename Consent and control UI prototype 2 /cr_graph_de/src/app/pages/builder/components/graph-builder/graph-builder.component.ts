import { Component, OnInit, Input, Output, EventEmitter, ElementRef, OnChanges } from '@angular/core';
import { Item } from '../../../../core/models/item.model';
import { Graph } from './model/graph.model';
import { DataHelper } from '../../../../shared/helpers/data.helper';
import { IconHelper } from '../../../../core/helpers/icon.helper';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { OptionalPathActions } from '../../../../core/actions/optional-path.actions';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../../app.store';
import { OptionalPath } from '../../../../core/models/optional-path.model';
import { ItemTypeEnum } from '../../../../core/enums/item-type.enum';
import { MatDialog } from '@angular/material';
import { LegendComponent } from './legend/legend.component';
import { AcceptedItem } from '../../../../core/models/accepted-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'cr-graph-builder',
  templateUrl: './graph-builder.component.html',
  styleUrls: ['./graph-builder.component.css']
})
export class GraphBuilderComponent implements OnInit {
    @Input() width: number;
    @Input() height: number;

    private targetItem: Item;
    private nativeElement: HTMLElement;
    private treeDataSource: any;
    private dataGraph: Graph;
    private isAcceptedMode: boolean = false;

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private optionalItemActions: OptionalPathActions,
        private elementRef: ElementRef,
        private dialog: MatDialog,
        private router: Router
    ) {
        ngRedux.select<Item>((s: IAppState) => s.core.selectedItem).subscribe(items => this.showGraph());
        ngRedux.select<AcceptedItem[]>((s: IAppState) => s.core.acceptedItems).subscribe(items => this.showGraph());
        ngRedux.select<OptionalPath[]>((s: IAppState) => s.core.selectedOptionalPaths).subscribe(paths => this.updateSelectedPath(paths));
        this.nativeElement = elementRef.nativeElement;

        const textwrap = require('d3-textwrap');
        d3.textwrap = textwrap.textwrap;
    }

    ngOnInit() {
        this.showGraph();
    }

    private showGraph() {
        const store = this.ngRedux.getState().core;

        if (!store.selectedItem) {
            this.drawMessage();
            return;
        }

        if (!this.nativeElement) {
            return;
        }

        this.dataGraph = new Graph({
            items: store.items,
            acceptedItem: store.acceptedItems,
            targetItem: store.selectedItem,
            filterItemIds: store.itemsToFilterBy.map(x => x.id),
            optionalPaths: store.optionalPaths
        });

        this.clear();
        this.buildDataSource(this.dataGraph);
        this.drawChart();
    }

    private updateSelectedPath(selectedPaths: OptionalPath[]) {
        if (!this.nativeElement) {
            return;
        }

        const store = this.ngRedux.getState().core;
        const paths = store.optionalPaths;
        if (store.optionalPaths.length === 0) {
            return;
        }

        let isAcceptedMode = false;
        store.acceptedItems.forEach(x => {
            if (x.path.includes(store.selectedItem.id)) {
                isAcceptedMode = true;
            }
        });

        if (!isAcceptedMode) {
            const unselectedPaths = _.differenceBy(paths, selectedPaths, x => x.id);
            unselectedPaths.forEach(x => this.markLineAsUnselected(x.path[1], x.path[0]));
            selectedPaths.forEach(x => this.markLineAsSelected(x.path[1], x.path[0]));
        }
    }

    private buildDataSource(data: Graph) {
        this.targetItem = data.targetItem;
        const result: Item[] = [new Item({id: 'root', name: 'ROOT', parentIds: []})];

        const relatedItems: Item[] = [data.targetItem];
        DataHelper.findChildren(data.items, data.targetItem, relatedItems);
        DataHelper.findParents(data.items, data.targetItem, relatedItems);

        const currentPaths = DataHelper.buildPath(data.items, data.targetItem);
        const filteredPaths = DataHelper.filterPath(currentPaths, data.filterItemIds);
        const matchedPaths = DataHelper.matchPaths(filteredPaths, data.acceptedItem.map(x => x.path));

        const filteredItems = _.filter(relatedItems, x => {
            let contains = false;
            _.forEach(filteredPaths, path => {
                if (path.includes(x.id)) {
                    contains = true;
                    return;
                }
            });

            return contains;
        });

        result.push(...filteredItems);

        const nodesData: any[] = result.map((x) => {
            const currentNode = {
                id: x.id,
                name: x.name,
                icon: IconHelper.getIcon(x.type),
                type: x.type,
                isAccepted: false,
                isTarget: this.targetItem.id === x.id,
                parent: 'root',
                parents: []
            };

            matchedPaths.forEach(matchedPath => {
                if (_.includes(matchedPath, x.id)) {
                    currentNode.isAccepted = true;
                    return;
                }
            });

            if (x.id === 'root') {
                currentNode.parent = null;
                return currentNode;
            }

            if (!_.isEmpty(x.parentIds)) {
                const parents = [];
                _.forEach(result, resultItem => {
                    if (_.includes(x.parentIds, resultItem.id)) {
                        parents.push(resultItem.id);
                    }
                });

                currentNode.parent = parents[0];
                currentNode.parents = parents.slice(1);
            }

            return currentNode;
        });

        this.treeDataSource = d3.stratify().id(x => x.id).parentId(x => x.parent)(nodesData);
    }

    private isPathOptional(id: string, parentId: string) {
        let result = false;
        this.dataGraph.optionalPaths.forEach(x => {
           if (x.path.includes(id) && x.path.includes(parentId)) {
               result = true;
           }
        });

        return result;
    }

    private getPathOptional(id: string, parentId: string) {
        let result = [];
        this.dataGraph.optionalPaths.forEach(x => {
           if (x.path.includes(id) && x.path.includes(parentId)) {
               result = x.path;
           }
        });

        return result;
    }

    private getOptionalPathId(id: string, parentId: string) {
        let result;
        this.dataGraph.optionalPaths.forEach(x => {
           if (x.path.includes(id) && x.path.includes(parentId)) {
               result = x.id;
           }
        });

        return result;
    }

    private isSelected(id: string, parentId: string) {
        let result = false;
        const path = this.getPathOptional(id, parentId).join(';');
        this.ngRedux.getState().core.selectedOptionalPaths.forEach((x, index) => {
            if (x.path.join(';') === path) {
                result = true;
            }
        });

        return result;
    }

    private getPathOptionalIds(id: string, parentId: string) {
        let path = [];
        this.dataGraph.optionalPaths.forEach(x => {
            if (x.path.includes(id) && x.path.includes(parentId)) {
                path = x.path;
            }
        });

        const result = [];
        path.forEach((x, index) => {
            if (index + 1 !== path.length) {
                result.push(x + '_' + path[index + 1]);
            }
        });

        return result;
    }

    private clear() {
        d3.select(this.nativeElement).select('#chart').selectAll('*').remove();
    }

    private drawMessage() {
        this.clear();

        if (!this.nativeElement) {
            return;
        }

        this.width = this.nativeElement.parentElement.clientWidth;
        this.height = this.nativeElement.parentElement.clientHeight - 10;

        const hist = d3.select(this.nativeElement).select('#chart');
        const info = hist
            .append('g')
            .attr('transform', 'translate(' + this.width / 2 + ', ' + this.height / 2 + ')');

        info.append('text')
            .attr('text-anchor', 'middle')
            .style('font-size', '2em')
            .style('fill', '#727272')
            .text('Bitte wählen Sie eine Funktion.');
    }

    private drawChart(): void {
        this.clear();
        const hist = d3.select(this.nativeElement).select('#chart');

        this.width = this.nativeElement.parentElement.clientWidth;
        this.height = this.nativeElement.parentElement.clientHeight - 10;

        const margin = { top: 25, right: 90, bottom: 5, left: 90 };
        const width = +this.width - margin.left - margin.right;
        const height = +this.height - margin.top - margin.bottom;
        const g = hist
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        const root = d3.hierarchy(this.treeDataSource);

        const rawNodes = root.descendants();
        _.forEach(rawNodes, x => {
            x.depth -= 1;
        });

        const tree = d3.tree().size([height, width]);
        tree(root);

        const flatNodes = root.descendants();
        const extraNodes = [];
        let nodes = flatNodes.slice(1);
        const nodesWithParents = _.filter(nodes, x => {
            const parents = x.data.data.parents;
            return parents && !_.isEmpty(parents);
        });

        _.forEach(nodesWithParents, x => {
            const parents = x.data.data.parents;
            _.forEach(parents, parentId => {
                const childClone = _.clone(x);
                const parent = _.find(nodes, item => item.data.id === parentId);
                childClone.parent = _.clone(parent);
                extraNodes.push(childClone);
            });
        });

        nodes = nodes.concat(extraNodes);
        const isAcceptedMode = this.isAcceptedMode = nodes[0].data.data.isAccepted;

        const link = g.selectAll('.link')
                .data(nodes)
                    .enter().append('path')
                        .attr('class', (d) => {
                            if (d.data.data.isAccepted) {
                                return 'link-accepted';
                            }

                            return this.isPathOptional(d.data.id, d.parent.data.id) ? 'link-optional' : 'link';
                        })
                        .attr('id', (d) => d.parent.data.id + '_' + d.data.id)
                        .attr('d', function(d) {
                            if (d.parent.data.id === 'root') {
                                return null;
                            }
                            return 'M' + d.y + ',' + d.x
                                + 'C' + (d.y + d.parent.y) / 2 + ',' + d.x
                                + ' ' + (d.y + d.parent.y) / 2 + ',' + d.parent.x
                                + ' ' + d.parent.y + ',' + d.parent.x;
                        });

        const node = g.selectAll('.node')
            .data(flatNodes.slice(1))
                .enter().append('g')
                    .attr('class', 'node--internal')
                    .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; });

        const maxDepthNode: any = _.maxBy(flatNodes, x => (x as any).depth);
        const dots = node.append('text')
            .attr('id', (d) => 'text_' + d.data.id)
            .style('font-size', (d) => d.data.id === 'purpose_9' ? '10px' : '12px')
            .attr('dominant-baseline', 'central')
            .attr('alignment-baseline', 'central')
            .text((d) => _.trim(d.data.data.name))
            .attr('class', (d) => !isAcceptedMode && this.isPathOptional(d.data.id, d.parent.data.id) ? 'node-clickable textlabel' : 'node textlabel' );

        const wrap = d3.textwrap().bounds({height: 48, width: 148}).method('tspans');
        d3.selectAll('.textlabel').call(wrap);

        d3.selectAll('.textlabel')
            .attr('y', function(d) {
                const textHeight = this.parentNode.getBBox().height;
                if (textHeight >= 27 && textHeight < 39) {
                    return -textHeight / 4;
                }

                if (textHeight >= 39) {
                    return -textHeight / 3;
                }

                return 0;
            })
            .attr('x', function(d) {
                const textWidth = this.parentNode.getBBox().width;
                return -textWidth / 2;
            });


        node.append('rect')
            .classed('recta', true)
            .attr('x', (d) => {
                const itemWidth = this.getItemWidth(d);
                return -itemWidth / 2 + (d.data.id === 'purpose_9' ? 3 : 0);
            })
            .attr('id', (d) => 'rect' + d.parent.data.id + '_' + d.data.id)
            .attr('y', (d) => {
                return d.depth === 0 ? -30 : -16;
            })
            .attr('rx', 15)
            .attr('ry', 15)
            .attr('width', (d) => this.getItemWidth(d))
            .attr('height', (d) => {
                return d.depth === 0 ? 60 : 30;
            })
            .style('fill', '#FFFFFF')
            .style('stroke-dasharray', (d) => {
                if (d.data.data.isAccepted) {
                    return 0;
                }

                return this.isPathOptional(d.data.id, d.parent.data.id) ? 5 : 0;
            })
            .style('stroke', d => this.getColor(d.data.data.type))
            .style('stroke-width', '3px')
            .style('cursor', (d) => !isAcceptedMode && this.isPathOptional(d.data.id, d.parent.data.id) ? 'pointer' : 'default' )
            .on('mouseover', (d, i) => { this.onMouseOver(d); })
            .on('mouseout', (d, i) => { this.onMouseOut(d); })
            .on('click', (d, i) => { this.onClick(d); });

        node.append('text')
            .classed('icon', true)
            .attr('dy', 5)
            .attr('dx', -5)
            .attr('x', (d) => {
                const itemWidth = this.getItemWidth(d);
                return -itemWidth / 2 - 2 + (d.data.id === 'purpose_9' ? 3 : 0);
            })
            .style('fill', (d) => this.getColor(d.data.data.type))
            .style('cursor', 'default')
            .attr('font-family', 'FontAwesome')
            .text(function(d) {
                return IconHelper.convertIconToUnicode(d.data.data.icon);
            });

        dots.on('mouseover', (d, i) => { this.onMouseOver(d); });
        dots.on('mouseout', (d, i) => { this.onMouseOut(d); });
        dots.on('click', (d, i) => { this.onClick(d); });

        d3.selectAll('.recta').each(function() {
            const firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });

        const helpe = hist
            .append('g')
            .attr('transform', 'translate(' + (this.width - 25) + ', 25)');

        helpe.append('circle')
            .style('stroke-width', '2px')
            .attr('r', 20)
            .style('cursor', 'pointer')
            .attr('stroke', '#bcbcbc')
            .attr('fill', '#f2f2f2')
            .on('click', (d, i) => {
                window.open('builder/help', '_blank');
            });

        helpe.append('text')
            .attr('text-anchor', 'middle')
            .style('font-size', '2em')
            .style('fill', '#727272')
            .style('cursor', 'pointer')
            .attr('dominant-baseline', 'central')
            .attr('font-family', 'FontAwesome')
            .text('\uf128')
            .on('click', (d, i) => {
                window.open('builder/help', '_blank');
            });

        const info = hist
            .append('g')
            .attr('transform', 'translate(10, 13)');

        info.append('text')
            .style('fill', d => this.getColor(ItemTypeEnum.Purpose))
            .attr('font-family', 'FontAwesome')
            .text(IconHelper.convertIconToUnicode(IconHelper.getIcon(ItemTypeEnum.Purpose)));
        info.append('text')
            .attr('x', 17)
            .text('Zweck');

        info.append('text')
            .attr('x', () => info.node().getBBox().width + 10)
            .style('fill', d => this.getColor(ItemTypeEnum.Data))
            .attr('font-family', 'FontAwesome')
            .text(IconHelper.convertIconToUnicode(IconHelper.getIcon(ItemTypeEnum.Data)));
        info.append('text')
            .attr('x', () => info.node().getBBox().width + 10)
            .text('Daten');

        info.append('text')
            .attr('x', () => info.node().getBBox().width + 10)
            .style('fill', d => this.getColor(ItemTypeEnum.Storage))
            .attr('font-family', 'FontAwesome')
            .text(IconHelper.convertIconToUnicode(IconHelper.getIcon(ItemTypeEnum.Storage)));
        info.append('text')
            .attr('x', () => info.node().getBBox().width + 8)
            .text('Speichern');

        info.append('text')
            .attr('x', () => info.node().getBBox().width + 10)
            .style('fill', d => this.getColor(ItemTypeEnum.Processing))
            .attr('font-family', 'FontAwesome')
            .text(IconHelper.convertIconToUnicode(IconHelper.getIcon(ItemTypeEnum.Processing)));
        info.append('text')
            .attr('x', () => info.node().getBBox().width + 10)
            .text('Datenverarbeitung');

        info.append('text')
            .attr('x', () => info.node().getBBox().width + 10)
            .style('fill', d => this.getColor(ItemTypeEnum.Sharing))
            .attr('font-family', 'FontAwesome')
            .text(IconHelper.convertIconToUnicode(IconHelper.getIcon(ItemTypeEnum.Sharing)));
        info.append('text')
            .attr('x', () => info.node().getBBox().width + 8)
            .text('Datenweitergabe');
    }

    private onClick(d) {
        if (this.isAcceptedMode) {
            return;
        }

        if (!this.isPathOptional(d.data.id, d.parent.data.id)) {
            return;
        }

        if (this.isSelected(d.data.id, d.parent.data.id)) {
            this.optionalItemActions.deselectPath(this.getOptionalPathId(d.data.id, d.parent.data.id));
        } else {
            this.optionalItemActions.selectPath(this.getOptionalPathId(d.data.id, d.parent.data.id));
        }
    }

    private onMouseOver(d) {
        if (this.isAcceptedMode) {
            return;
        }

        if (!this.isPathOptional(d.data.id, d.parent.data.id) || this.isSelected(d.data.id, d.parent.data.id)) {
            return;
        }

        this.markLineAsSelected(d.data.id, d.parent.data.id);
    }

    private onMouseOut(d) {
        if (this.isAcceptedMode) {
            return;
        }

        if (!this.isPathOptional(d.data.id, d.parent.data.id) || this.isSelected(d.data.id, d.parent.data.id)) {
            return;
        }

        this.markLineAsUnselected(d.data.id, d.parent.data.id);
    }

    private getColor(type: ItemTypeEnum) {
        switch (type) {
            case ItemTypeEnum.Purpose:
                return '#00841a';
            case ItemTypeEnum.Data:
                return '#ff0000';
            case ItemTypeEnum.Storage:
                return '#c633f7';
            case ItemTypeEnum.Processing:
                return '#ff9232';
            case ItemTypeEnum.Sharing:
                return '#000000';
        }
    }

    private getItemWidth(d) {
        const selection = d3.select('#text_' + d.data.id);
        if (!selection.node()) {
            return 110;
        }

        const width = selection.node().getBBox().width + 25;

        return _.max([width, 110]);
    }

    private markLineAsSelected(id: string, parentId: string) {
        this.getPathOptionalIds(id, parentId).forEach(x => {
            d3.select('#rect' + x).style('stroke-dasharray', 0);
            d3.select('#' + x).classed('link-optional', false);
            d3.select('#' + x).classed('link', true);
        });
    }

    private markLineAsUnselected(id: string, parentId: string) {
        this.getPathOptionalIds(id, parentId).forEach(x => {
            d3.select('#rect' + x).style('stroke-dasharray', 5);
            d3.select('#' + x).classed('link-optional', true);
            d3.select('#' + x).classed('link', false);
        });
    }
}
