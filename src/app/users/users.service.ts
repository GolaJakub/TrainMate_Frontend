import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {MenteeData, UserData} from "./user-data.model";
import {OAuthService} from "angular-oauth2-oidc";
import {Observable, tap} from "rxjs";

@Injectable({providedIn: 'root'})
export class UsersService {

  baserUrl = 'http://localhost:8080/api/tm-core/mentees';

  private currentUser!: UserData;

  constructor(private httpClient: HttpClient, private oAuthService: OAuthService) {
  }

  getCurrentUserData(): Observable<UserData> {
    return this.httpClient.get<UserData>('http://localhost:8080/api/tm-core/users/get-current-user-info', {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
      }
    }).pipe(
      tap(userData => this.currentUser = userData)
    );
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role || false;
  }

  saveMentee(menteeData: MenteeData) {
    return this.httpClient.put<MenteeData>(`${this.baserUrl}/update-personal-data`, menteeData, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    })
  }

  logout(): void {
    this.oAuthService.logOut();
  }
}
