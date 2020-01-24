
import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-intro',
    templateUrl: './intro.component.html'
})
export class IntroComponent implements OnInit {
  locale = 'en';
    constructor(
      private router: Router,
      @Inject(LOCALE_ID) protected localeId: string) {
        if (localeId === 'de') {
          this.locale = 'de';
        }
      }


    selectedIndex = 0;

    ngOnInit() {
    }

    onStart() {
        this.router.navigate(['/help']);
    }

    onGoToTab(tabIndex: number) {
        this.selectedIndex = tabIndex;
    }
}
