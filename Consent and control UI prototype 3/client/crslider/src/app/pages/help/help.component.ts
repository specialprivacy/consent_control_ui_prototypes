
import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit {
  locale = 'en';
    constructor(
      @Inject(LOCALE_ID) protected localeId: string,
      private router: Router
      ) {
        if (localeId === 'de') {
          this.locale = 'de';
        }
      }

    selectedIndex = 0;

    ngOnInit() {
    }

    onStart() {
        this.router.navigate(['']);
    }

    onIntro() {
        this.router.navigate(['intro']);
    }

    onGoToTab(tabIndex: number) {
        this.selectedIndex = tabIndex;
    }
}
