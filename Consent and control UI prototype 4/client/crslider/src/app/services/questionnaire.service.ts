import { Injectable } from '@angular/core';
import { QuestionnaireItem } from '../models/questionnaire-item';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class QuestionnaireService {
    constructor(
      private http: HttpClient,
      private cookieService: CookieService) {
    }

    saveQuestionnaire(items: QuestionnaireItem[]) {
      this.http.post('api/questionnaire', items).subscribe();
    }

    loadQuestionnaire(code: string): Observable<QuestionnaireItem[]> {
      const userUid = this.cookieService.get('user_uid');
      return this.http.get<QuestionnaireItem[]>(`api/questionnaire/${userUid}/${code}`);
    }

}
