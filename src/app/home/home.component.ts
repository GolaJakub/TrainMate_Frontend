import {Component, OnInit} from '@angular/core';
import {UserData} from "../users/user-data.model";
import {NgIf} from "@angular/common";
import {PeriodicalReportComponent} from "../reports/periodical-report/periodical-report.component";
import {UserStateService} from "../users/user-state.service";
import {PersonalDataComponent} from "../users/personal-data/personal-data.component";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";


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

  constructor(private userStateService: UserStateService, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.currentUser = this.userStateService.getCurrentUser();
    this.userStateService.currentUser$.subscribe(
      userData => {
        this.currentUser = userData;
        this.redirectBasedOnRole();
      },
      error => {
        this.snackBar.open(error.error[0].description, 'Close', {duration: 3000});
      }
    );
  }

  redirectBasedOnRole(): void {
    if (this.currentUser?.role === 'PERSONAL_TRAINER') {
      this.router.navigate(['/mentees']);
    } else if (this.currentUser?.role === 'MENTEE' && this.currentUser?.firstLogin && this.currentUser?.personalInfo?.firstname) {
      this.router.navigate(['/periodical-report']);
    } else if (this.currentUser?.role === 'MENTEE' && this.currentUser?.firstLogin && !this.currentUser?.personalInfo?.firstname) {
      this.router.navigate(['/personal-data']);
    } else if (this.currentUser?.role === 'MENTEE' && !this.currentUser?.firstLogin) {
      this.router.navigate(['/current-workout']);
    }
  }
}
