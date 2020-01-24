
import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-intro',
    templateUrl: './intro.component.html'
})
export class IntroComponent implements OnInit {
  locale = 'en';

  code = '';

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      @Inject(LOCALE_ID) protected localeId: string) {
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
      this.router.navigate(['/help', this.code]);
    }

    onGoToTab(tabIndex: number) {
        this.selectedIndex = tabIndex;
    }
}
