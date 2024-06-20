import {Component, OnInit} from '@angular/core';
import {UserData} from "../users/user-data.model";
import {UsersService} from "../users/users.service";
import {NgIf} from "@angular/common";
import {PeriodicalReportComponent} from "../reports/periodical-report/periodical-report.component";
import {UserStateService} from "../users/user-state.service";
import {PersonalDataComponent} from "../users/personal-data/personal-data.component";


@Component({
  selector: 'tm-home',
  standalone: true,
  imports: [
    NgIf,
    PeriodicalReportComponent,
    PersonalDataComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: UserData | null = null;

  constructor(private userStateService: UserStateService) {
  }

  ngOnInit(): void {
    this.currentUser = this.userStateService.getCurrentUser();
    this.userStateService.currentUser$.subscribe(
      userData => {
        this.currentUser = userData;
      },
      error => {
        console.error('Error fetching user data', error);
      }
    );
  }

  isMenteeFirstLogin(): boolean {
    return !!(this.currentUser?.firstLogin && this.currentUser.role === 'MENTEE');

  }
}
