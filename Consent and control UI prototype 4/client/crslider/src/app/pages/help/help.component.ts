
import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit {
  locale = 'en';

  code = '';
    constructor(
      private route: ActivatedRoute,
      @Inject(LOCALE_ID) protected localeId: string,
      private router: Router
      ) {
        if (localeId === 'de') {
          this.locale = 'de';
        }
      }

    selectedIndex = 0;

    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.code = params.get('code');
      });
    }

    onStart() {
        this.router.navigate(['', this.code]);
    }

    onIntro() {
        this.router.navigate(['intro', this.code]);
    }

    onGoToTab(tabIndex: number) {
        this.selectedIndex = tabIndex;
    }
}
