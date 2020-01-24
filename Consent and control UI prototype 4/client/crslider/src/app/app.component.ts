import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  constructor( private cookieService: CookieService ) { }

  ngOnInit(): void {
    if (!this.cookieService.get('user_uid')) {
      this.cookieService.set( 'user_uid', Guid.create().toString());
    }
  }
}
