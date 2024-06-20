import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {UserData} from "./user-data.model";
import {UsersService} from "./users.service";


@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private currentUserSubject: BehaviorSubject<UserData | null> = new BehaviorSubject<UserData | null>(null);
  public currentUser$: Observable<UserData | null> = this.currentUserSubject.asObservable();

  constructor(private usersService: UsersService) {}

  loadCurrentUser() {
    this.usersService.getCurrentUserData().subscribe(
      userData => {
        this.currentUserSubject.next(userData);
      },
      error => {
        console.error('Error fetching user data', error);
        this.currentUserSubject.next(null);
      }
    );
  }

  getCurrentUser(): UserData | null {
    return this.currentUserSubject.value;
  }

  isFirstLogin(): boolean | undefined {
    return this.getCurrentUser()?.firstLogin;
  }
}
