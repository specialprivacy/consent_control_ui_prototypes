
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'cr-intro',
    templateUrl: './intro.component.html'
})
export class IntroComponent implements OnInit {
    constructor(private router: Router) { }

    selectedIndex: number = 0;

    ngOnInit() {
    }

    onStart() {
        this.router.navigate(['builder/help']);
    }

    onGoToTab(tabIndex: number) {
        this.selectedIndex = tabIndex;
    }
}
