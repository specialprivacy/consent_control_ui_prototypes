import { Component, OnInit, Input, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';
import * as d3Base from 'd3';
import { IconHelper } from './helpers/icon.helper';
import { ItemTypeEnum } from './enums/item-type.enum';
import { Graph } from './model/graph.model';
import { Item } from './model/item.model';
import { DataHelper } from './helpers/data.helper';
import { textwrap } from 'd3-textwrap';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  private width: number;
  private height: number;
  private targetItem: Item;
  private nativeElement: HTMLElement;
  private treeDataSource: any;
  private dataGraph: Graph;

  constructor(
    public dialogRef: MatDialogRef<GraphComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private elementRef: ElementRef
  ) {
      this.nativeElement = elementRef.nativeElement;

      // Object.assign(d3, { textwrap });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
      this.showGraph();
  }

  private showGraph() {
    if (!this.nativeElement) {
        return;
    }

    this.dataGraph = new Graph({
        items: this.data.items,
        targetItem: this.data.target
    });

    this.clear();
    this.buildDataSource(this.dataGraph);
    this.drawChart();
  }

  private buildDataSource(data: Graph) {
    this.targetItem = data.targetItem;
    const result: Item[] = [new Item({id: 'root', name: 'ROOT', parentIds: []})];

    const relatedItems: Item[] = [data.targetItem];
    DataHelper.findChildren(data.items, data.targetItem, relatedItems);
    DataHelper.findParents(data.items, data.targetItem, relatedItems);

    result.push(...relatedItems);

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

    const d3 = Object.assign(d3Base, { textwrap });
    this.treeDataSource = d3.stratify().id(x => x.id).parentId(x => x.parent)(nodesData);

  }

  private clear() {
    const d3 = Object.assign(d3Base, { textwrap });
    d3.select(this.nativeElement).select('#chart').selectAll('*').remove();
  }

  private drawChart(): void {
    this.clear();
    const d3 = Object.assign(d3Base, { textwrap });
    const hist = d3.select(this.nativeElement).select('#chart');

    this.width = 850;
    this.height = 560 - 10;

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
            const parent = _.find(nodes, item => item.data.id.toString() === parentId.toString());
            childClone.parent = _.clone(parent);
            extraNodes.push(childClone);
        });
    });

    nodes = nodes.concat(extraNodes);
    // const isAcceptedMode = nodes[0].data.data.isAccepted;

    const link = g.selectAll('.link')
            .data(nodes)
                .enter().append('path')
                    .attr('class', (d) => {
                        if (d.data.data.isAccepted) {
                            return 'link-accepted';
                        }

                        return 'link';
                    })
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
        .style('font-size', '12px')
        .attr('dominant-baseline', 'central')
        .attr('alignment-baseline', 'central')
        .text((d) => _.trim(d.data.data.name))
        .attr('class', (d) => 'node textlabel' );

    const wrap = d3.textwrap().bounds({height: 48, width: 140}).method('tspans');
    d3.selectAll('.textlabel').call(wrap);

    const me = this;
    d3.selectAll('.textlabel')
        .attr('y', function(d) {
            const textHeight = this.parentNode.getBBox().height;
            let result = 0;

            if (textHeight > 14) {
              result = -textHeight / 4;
            }

            if (me.data.locale === 'de' && d.data.id === '8') {
              result += 4;
            }

            return result;
        })
        .attr('x', function(d) {
            const textWidth = this.parentNode.getBBox().width;
            return -textWidth / 2;
        });


    node.append('rect')
        .classed('recta', true)
        .attr('x', (d) => {
            const itemWidth = this.getItemWidth(d);
            // return d.depth === 0 ? -5 : d.depth === maxDepthNode.depth ? -itemWidth + 5 : -itemWidth / 2;
            return -itemWidth / 2;
        })
        .attr('id', (d) => 'rect' + d.parent.data.id + '_' + d.data.id)
        .attr('y', (d) => {
            return d.depth === 0 ? -23 : -16;
        })
        .attr('rx', 15)
        .attr('ry', 15)
        .attr('width', (d) => this.getItemWidth(d))
        .attr('height', (d) => {
          let recheight = d.depth === 0 ? 48 : 30;
          if (this.data.locale === 'de' && d.data.id === '8') {
            recheight = 80;
          }
          if (this.data.locale === 'de' && d.data.id === '9') {
            recheight = 60;
          }

          return recheight;
        })
        .style('fill', '#FFFFFF')
        .style('stroke-dasharray', (d) => {
            if (d.data.data.isAccepted) {
                return 0;
            }

            return 0;
        })
        .style('stroke', d => this.getColor(d.data.data.type))
        .style('stroke-width', '3px')
        .style('cursor', (d) => 'default' );

    node.append('text')
        .classed('icon', true)
        .attr('dy', 5)
        .attr('dx', -5)
        .attr('x', (d) => {
            const itemWidth = this.getItemWidth(d);
            return -itemWidth / 2 - 2;
        })
        .style('fill', (d) => this.getColor(d.data.data.type))
        .style('cursor', 'default')
        .attr('font-family', 'FontAwesome')
        .text(function(d) {
            return IconHelper.convertIconToUnicode(d.data.data.icon);
        });

    d3.selectAll('.recta').each(function() {
        const firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });

    const locale = this.data.locale;
    let legend = ['purpose', 'data', 'storage', 'processing', 'sharing'];
    if (locale === 'de') {
      legend = ['Zweck', 'Daten', 'Speichern', 'Datenverarbeitung', 'Datenweitergabe'];
    }

    const info = hist
        .append('g')
        .attr('transform', 'translate(10, 13)');

    info.append('text')
        .style('fill', d => this.getColor(ItemTypeEnum.Purpose))
        .attr('font-family', 'FontAwesome')
        .text(IconHelper.convertIconToUnicode(IconHelper.getIcon(ItemTypeEnum.Purpose)));
    info.append('text')
        .attr('x', 17)
        .text(legend[0]);

    info.append('text')
        .attr('x', () => info.node().getBBox().width + 10)
        .style('fill', d => this.getColor(ItemTypeEnum.Data))
        .attr('font-family', 'FontAwesome')
        .text(IconHelper.convertIconToUnicode(IconHelper.getIcon(ItemTypeEnum.Data)));
    info.append('text')
        .attr('x', () => info.node().getBBox().width + 10)
        .text(legend[1]);

    info.append('text')
        .attr('x', () => info.node().getBBox().width + 10)
        .style('fill', d => this.getColor(ItemTypeEnum.Storage))
        .attr('font-family', 'FontAwesome')
        .text(IconHelper.convertIconToUnicode(IconHelper.getIcon(ItemTypeEnum.Storage)));
    info.append('text')
        .attr('x', () => info.node().getBBox().width + 8)
        .text(legend[2]);

    info.append('text')
        .attr('x', () => info.node().getBBox().width + 10)
        .style('fill', d => this.getColor(ItemTypeEnum.Processing))
        .attr('font-family', 'FontAwesome')
        .text(IconHelper.convertIconToUnicode(IconHelper.getIcon(ItemTypeEnum.Processing)));
    info.append('text')
        .attr('x', () => info.node().getBBox().width + 10)
        .text(legend[3]);

    info.append('text')
        .attr('x', () => info.node().getBBox().width + 10)
        .style('fill', d => this.getColor(ItemTypeEnum.Sharing))
        .attr('font-family', 'FontAwesome')
        .text(IconHelper.convertIconToUnicode(IconHelper.getIcon(ItemTypeEnum.Sharing)));
    info.append('text')
        .attr('x', () => info.node().getBBox().width + 8)
        .text(legend[4]);
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
    const d3 = Object.assign(d3Base, { textwrap });
      const selection = d3.select('#text_' + d.data.id);
      if (!selection.node()) {
          return 110;
      }

      const width = selection.node().getBBox().width + 25;

      return _.max([width, 110]);
  }

  private getFullItemWidth(d) {
    const d3 = Object.assign(d3Base, { textwrap });
      const selection = d3.select('#text_' + d.data.id);
      if (!selection.node()) {
          return 0;
      }

      return selection.node().getBBox().width;
  }

}
