import { Component, OnInit, Input, Output, EventEmitter, ElementRef, OnChanges } from '@angular/core';
import { Item } from '../../../../core/models/item.model';
import { DataHelper } from '../../../../shared/helpers/data.helper';
import { IconHelper } from '../../../../core/helpers/icon.helper';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../../app.store';
import { ItemHelper } from '../../../../core/helpers/item.helper';
import { ItemTypeEnum } from '../../../../core/enums/item-type.enum';

@Component({
    selector: 'cr-summary-graph',
    templateUrl: './summary-graph.component.html',
    styleUrls: ['./summary-graph.component.css']
})
export class SummaryGraphComponent implements OnInit {
    private width: number;
    private height: number;
    private nativeElement: HTMLElement;
    private treeDataSource: any;

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private itemHelper: ItemHelper,
        private elementRef: ElementRef) {
        this.nativeElement = elementRef.nativeElement;

        const tip = require('d3-tip');
        d3.tip = tip.default;
    }

    ngOnInit() {
        const store = this.ngRedux.getState().core;
        this.clear();
        this.buildDataSource();
        this.drawChart();
    }

    clear() {
        const hist = d3.select(this.nativeElement).select('#chart');
        hist.selectAll('*').remove();
        d3.selectAll('.d3-tip').remove();
    }

    private buildDataSource() {
        const store = this.ngRedux.getState().core;
        const result: Item[] = [new Item({id: 'root', name: 'ROOT', parentIds: []})];

        const items: Item[] = [];
        _.forEach(store.acceptedItems, acceptedItems => {
            _.forEach(acceptedItems.path, (itemId, index) => {
                let item = _.find(result, x => x.id === itemId);
                if (!item) {
                    item = Object.assign({}, this.itemHelper.findById(itemId));
                    item.parentIds = [];
                    result.push(item);
                }

                if (index === 0) {
                    item.parentIds = ['root'];
                } else {
                    item.parentIds.push(acceptedItems.path[index - 1]);
                }
            });
        });

        const nodesData: any[] = result.map((x) => {
            const currentNode = {
                id: x.id,
                name: x.name,
                icon: IconHelper.getIcon(x.type),
                isAccepted: true,
                type: x.type,
                parent: (x.id === 'root') ? null : x.id,
                parents: []
            };

            if (x.id === 'root') {
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

    private drawChart(): void {
        const hist = d3.select(this.nativeElement).select('#chart');
        hist.selectAll('*').remove();

        this.width = 900;
        this.height = 400;

        const margin = { top: 25, right: 25, bottom: 5, left: 25 };
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

        const link = g.selectAll('.link')
                .data(nodes)
                    .enter().append('path')
                        .attr('class', 'link')
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

        const dots = node.append('text')
            .attr('dy', 5)
            .attr('dx', -5)
            .style('fill', (d) => this.getColor(d.data.data.type))
            .style('cursor', 'default')
            .attr('font-family', 'FontAwesome')
            .text(function(d) {
                return IconHelper.convertIconToUnicode(d.data.data.icon);
            });

        d3.selectAll('.d3-tip').remove();

        const offsetTooltip = (this.nativeElement.ownerDocument.scrollingElement as any).offsetTop;
        const offsetTooltipLeft = (this.nativeElement.ownerDocument.scrollingElement as any).offsetLeft;
        const tooltip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10 - offsetTooltip, -offsetTooltipLeft])
            .html(function(d) {
                return d.data.data.name;
            });


        hist.call(tooltip);
        dots.on('mouseover', tooltip.show)
            .on('mouseout', tooltip.hide);
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

}
