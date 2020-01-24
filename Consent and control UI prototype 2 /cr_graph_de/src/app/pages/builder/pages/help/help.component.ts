
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'cr-builder-intro',
    templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit {
    constructor(private router: Router) { }

    selectedIndex: number = 0;

    ngOnInit() {
    }

    onStart() {
        this.router.navigate(['builder']);
    }

    onIntro() {
        this.router.navigate(['builder/intro']);
    }

    onGoToTab(tabIndex: number) {
        this.selectedIndex = tabIndex;
    }
}
