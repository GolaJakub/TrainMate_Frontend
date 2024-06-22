import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {OAuthService} from "angular-oauth2-oidc";
import {
  FileStorageDto,
  PeriodicalReportCreateDto,
  PeriodicalReportProjection,
  PeriodicalReportUpdateDto
} from "./reports.model";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class PeriodicalReportService {
  baseUrl = 'http://localhost:8080/api/tm-core';

  constructor(private httpClient: HttpClient, private oAuthService: OAuthService) {
  }

  submitInitialPeriodicalReport(periodicalReportData: PeriodicalReportCreateDto) {
    return this.httpClient.post<PeriodicalReportCreateDto>(`${this.baseUrl}/mentees/initial-report`, periodicalReportData, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    });
  }

  submitPeriodicalReport(periodicalReportData: PeriodicalReportCreateDto) {
    return this.httpClient.post<PeriodicalReportCreateDto>(`${this.baseUrl}/workout-plan/${periodicalReportData.workoutPlanId}/report`, periodicalReportData, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    });
  }

  updatePeriodicalReport(reportId: number, periodicalReportData: PeriodicalReportUpdateDto) {
    return this.httpClient.put<void>(`${this.baseUrl}/workout-plan/report/${reportId}`, periodicalReportData, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    });
  }

  getPeriodicalReport(reportId: number): Observable<PeriodicalReportProjection> {
    return this.httpClient.get<PeriodicalReportProjection>(`${this.baseUrl}/periodical/${reportId}`, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    });
  }

  getReportFiles(reportId: number): Observable<FileStorageDto[]> {
    return this.httpClient.get<FileStorageDto[]>(`${this.baseUrl}/file/${reportId}/get-all`, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
      }
    });
  }
}
