import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {MenteeProjection, MenteeSearchCriteria, WorkoutPlan, WorkoutPlanUpdateDto} from './mentees-list/mentee.model';
import { Page } from '../common/page';
import {OAuthService} from "angular-oauth2-oidc";
import {FileStorageDto, PeriodicalReportProjection} from "../reports/periodical-report/reports.model";

@Injectable({ providedIn: 'root' })
export class MenteeService {

  baseUrl = 'http://localhost:8080/api/tm-core';

  constructor(private httpClient: HttpClient, private oAuthService: OAuthService) { }

  searchMentees(criteria: MenteeSearchCriteria): Observable<Page<MenteeProjection>> {
    const params = new HttpParams()
      .set('page', criteria.page ? criteria.page.toString() : '0')
      .set('size', criteria.pageSize ? criteria.pageSize.toString() : '5')
      .set('sort', criteria.sort ? criteria.sort : 'lastname,asc');
    return this.httpClient.post<Page<MenteeProjection>>(`${this.baseUrl}/mentees/search`, criteria, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
        'Content-Type': 'application/json'
      },
      params: params
    });
  }

  getMentee(userId: string): Observable<MenteeProjection> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.post<MenteeProjection>(`${this.baseUrl}/mentees/${userId}`, {}, { headers });
  }

  getWorkoutPlans(keycloakId: string): Observable<WorkoutPlan[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.get<WorkoutPlan[]>(`${this.baseUrl}/workout-plan/${keycloakId}/all`, { headers });
  }

  getWorkoutPlansForCurrentlyLoggedUser(): Observable<WorkoutPlan[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.get<WorkoutPlan[]>(`${this.baseUrl}/workout-plan/my-plans`, { headers });
  }

  getInitialReport(keycloakId: string): Observable<PeriodicalReportProjection> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.get<PeriodicalReportProjection>(`${this.baseUrl}/initial/${keycloakId}`, { headers });
  }

  getPeriodicalReport(reportId: number): Observable<PeriodicalReportProjection> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.get<PeriodicalReportProjection>(`${this.baseUrl}/periodical/${reportId}`, { headers });
  }

  getReportFiles(reportId: number): Observable<FileStorageDto[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.get<FileStorageDto[]>(`${this.baseUrl}/file/${reportId}/get-all`, { headers });
  }

  reviewPeriodicalReport(reportId: number, dto: { id: number, version: number }): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.post<void>(`${this.baseUrl}/workout-plan/report/${reportId}/review`, dto, { headers });
  }

  deleteWorkoutPlan(workoutPlanId: number, dto: { id: number, version: number }): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/workout-plan/${workoutPlanId}/delete`, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
      },
      body: dto
    });
  }

  activateAccount(userId: string): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/mentees/${userId}/activate`,'',{
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
      }
    });
  }

  deactivateAccount(userId: string): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/mentees/${userId}/deactivate`,'',{
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
      }
    });
  }




}



