import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {OAuthService} from "angular-oauth2-oidc";

@Injectable({
  providedIn: 'root'
})
export class InviteMenteeService {
  baserUrl = 'http://localhost:8080/api/tm-core/mentees';

  constructor(private http: HttpClient, private oAuthService: OAuthService) {}

  invite(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post<number>(`${this.baserUrl}/invite`, '',{
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
        'Content-Type': 'application/json'
      },
      params: params
    })
  }
}
