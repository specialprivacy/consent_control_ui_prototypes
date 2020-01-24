import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  constructor(
    private cookieService: CookieService,
    private http: HttpClient) {
  }

  save(data: Map<number, boolean>) {
    const result = [];
    data.forEach((value, key) => {
      result.push({itemId: key, selected: value});
    });

    this.http.post('api/preferences', {userUid: this.cookieService.get('user_uid'), value: JSON.stringify(result) }).subscribe();
  }
}
