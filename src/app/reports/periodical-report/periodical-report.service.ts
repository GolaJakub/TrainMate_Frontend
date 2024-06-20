import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {OAuthService} from "angular-oauth2-oidc";
import {PeriodicalReportCreateDto} from "./reports.model";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class PeriodicalReportService {
  baserUrl = 'http://localhost:8080/api/tm-core/mentees';

  constructor(private httpClient: HttpClient, private oAuthService: OAuthService) {
  }

  submitPeriodicalReport(periodicalReportData: PeriodicalReportCreateDto) {
    return this.httpClient.post<PeriodicalReportCreateDto>(`${this.baserUrl}/initial-report`, periodicalReportData, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    })
  }


}
