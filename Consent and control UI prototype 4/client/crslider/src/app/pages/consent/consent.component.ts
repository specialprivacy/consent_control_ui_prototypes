import { ItemService } from './../../services/item.service';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSliderChange } from '@angular/material';
import { Options } from 'ng5-slider/options';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { GraphComponent } from './graph/graph.component';
import { Item } from './graph/model/item.model';
import { ItemTypeEnum } from './graph/enums/item-type.enum';
import { IconHelper } from './graph/helpers/icon.helper';
import { DataHelper } from './graph/helpers/data.helper';
import { PreferencesService } from 'src/app/services/preferences.service';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.css']
})
export class ConsentComponent implements OnInit {
  private selectedItems: Map<number, boolean> = new Map();
  message1 = false;
  message2 = false;
  message3 = false;
  code = '';

  cardWidth = '900px';
  options: Options;
  value = 0;
  items: any[] = [];
  functionalities: any[] = [];
  connections: any[] = [];
  datashared = [];

  groupsMap: Map<number, number[]> = new Map();


  constructor(
    private route: ActivatedRoute,
    @Inject(LOCALE_ID) protected localeId: string,
    public itemService: ItemService,
    private preferencesService: PreferencesService,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient) {
      if (localeId === 'de') {
        this.cardWidth = '1100px';
      }
      this.initSlider();

      this.groupsMap.set(0, []);
      this.groupsMap.set(1, [1, 2, 6, 7]);
      this.groupsMap.set(2, [1, 2, 6, 7, 3, 4]);
      this.groupsMap.set(3, [1, 2, 6, 7, 3, 4, 5, 8]);
      this.groupsMap.set(4, [1, 2, 6, 7, 3, 4, 5, 8, 11]);
      this.groupsMap.set(5, [1, 2, 6, 7, 3, 4, 5, 8, 11, 9, 10]);

      this.http.get('api/item').subscribe((x: any[]) => {
        this.items = x;
        const ordering = {};
        const sordOrder = this.groupsMap.get(this.groupsMap.size - 1);

        const filteredItems =  x.filter(y => y.itemGroupId === 1);

        for (let i = 0; i < sordOrder.length; i++) {
          ordering[sordOrder[i]] = i;
        }

        filteredItems.sort( function(a, b) {
          return (ordering[a.id] - ordering[b.id]);
        });

        this.functionalities = filteredItems;
        this.http.get('api/itemgraph').subscribe((d: any[]) => {
          this.connections = d;
          this.init();
        });
      });
    }

    onMainHelpClick() {
      window.open('help/' + this.code, '_blank');
    }

    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        this.code = params.get('code');
        this.message1 = (this.code === 'qwerty');
        this.message2 = (this.code === 'ytrewq');
        this.message3 = !this.message1 && !this.message2;
      });
    }

    initSlider() {
      let groups = ['No Functionality', 'Health Data', 'Map Visualization', 'Fitness Adviser', 'Back - Up', 'Marketing & BI'];
      if (this.localeId === 'de') {
        // tslint:disable-next-line:max-line-length
        groups = ['Keine Funktionalität', 'Gesundheitsdaten', 'Visualisierung auf einer Karte', 'Fitnessberater', 'Sicherungskopie', 'Marketing & BI'];
      }

      const options: Options = {
        floor: 0,
        ceil: 5,
        vertical: true,
        showTicks: true,
        rightToLeft: true,
        showSelectionBar: true,
        showTicksValues: true,
        getLegend: (): string => {
          return '';
        },
        translate: (value: number): string => {
          return groups[value];
        },
        getSelectionBarColor: (): string => {
          return 'rgba(255,64,129,.54)';
        },
        getPointerColor: (): string => {
          return '#ff4081';
        }
      };

      this.options = options;
    }

    onHelpClick(target) {
      const items = [];
      _.forEach(this.items, currentItem => {
        const item2 = new Item();
        item2.id = currentItem.id;
        item2.type = DataHelper.getTypeById(currentItem.itemGroupId);
        item2.name = currentItem.name;
        item2.parentIds = this.findParentIds(currentItem.id);
        item2.icon = IconHelper.getIcon(DataHelper.getTypeById(currentItem.itemGroupId));
        items.push(item2);
      });

      const dialogRef = this.dialog.open(GraphComponent, {
        data: {target: items.filter(x => x.id === target.id)[0], items: items, locale: this.localeId}
      });
    }

    findParentIds(id): any[] {
      const result = [];
      _.forEach(this.connections, connection => {
        if (connection.childId === id) {
          result.push(connection.parentId);
        }
      });
      return result;
    }

    onValueChange(event: MatSliderChange) {
      this.value = event.value;
    }

    init() {
      _.forEach(this.functionalities, functionality => {
        const childrenIds = this.connections.filter(x => x.parentId === functionality.id).map(x => x.childId);
        const childrenNames = [];
        _.forEach(childrenIds, childId  => {
          const child = this.items.find(x => x.id === childId);
          childrenNames.push(child.name);
        });

        this.datashared.push(childrenNames.sort().join(', '));
      });
    }

    isAvailable(id: number, groupIndex: number) {
      const listItems = this.groupsMap.get(groupIndex);

      return listItems.indexOf(id) === -1;
    }

    onSliderValueChange(event) {
      this.value = event.value;

      const listItems: number[] = this.groupsMap.get(event.value);
      const selected: Map<number, boolean> = new Map();

      const keys = [];
      this.selectedItems.forEach((value, key) => {
        keys.push(key);
      });

      const commonItems = _.intersection(keys, listItems);
      _.forEach(listItems, itemId => {
        if (commonItems.includes(itemId)) {
          selected.set(itemId, this.selectedItems.get(itemId));
        } else {
          selected.set(itemId, true);
        }
      });

      this.selectedItems = selected;
    }

    onComplete() {
      this.preferencesService.save(this.selectedItems, this.code);
      this.router.navigate(['questionnaire', this.code]);
    }

    onCheckBoxChange(itemId, event) {
      this.selectedItems.set(itemId, event.checked);
    }

}
