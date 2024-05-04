import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserData} from "./user-data.model";
import {OAuthService} from "angular-oauth2-oidc";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class UsersService {

  constructor(private httpClient: HttpClient, private oAuthService: OAuthService) {
  }


  getCurrentUserData$(): Observable<UserData> {
    return this.httpClient.post<UserData>('http://localhost:8080/api/tm-core/users/get-current-user-info', '',{
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
      }
    })
  }
}
