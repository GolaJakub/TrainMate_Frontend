import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {faCheckCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ReportDialog} from '../../reports/periodical-report/report-dialog.component';
import {MenteeProjection, WorkoutPlan} from '../mentees-list/mentee.model';
import {MenteeService} from '../mentee.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {WorkoutsService} from "../../workouts/workouts.service";

@Component({
  selector: 'app-mentee-details',
  templateUrl: './mentee-details.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgForOf,
    FontAwesomeModule,
    NgClass,
    DatePipe,
    NgIf,
    RouterLink
  ],
  styleUrls: ['./mentee-details.component.css']
})
export class MenteeDetailsComponent implements OnInit {
  mentee: MenteeProjection | null = null;
  workoutPlans: WorkoutPlan[] = [];
  pageSize = 5;
  currentPage = 0;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;

  constructor(
    private route: ActivatedRoute,
    private menteeService: MenteeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private workoutsService: WorkoutsService
  ) {
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.menteeService.getMentee(userId).subscribe(
        mentee => this.mentee = mentee,
        error => this.snackBar.open(error.error[0].description, 'Close', {duration: 3000})
      );
      this.loadWorkoutPlans(userId);
    }
  }

  loadWorkoutPlans(userId: string): void {
    this.menteeService.getWorkoutPlans(userId).subscribe(
      plans => {
        this.workoutPlans = plans;
      },
      error => this.snackBar.open(error.error[0].description, 'Close', {duration: 3000})
    );
  }

  openInitialReportModal(): void {
    if (this.mentee) {
      this.menteeService.getInitialReport(this.mentee.userId.keycloakId).subscribe(
        report => {
          this.menteeService.getReportFiles(report.id).subscribe(
            files => {
              this.dialog.open(ReportDialog, {
                data: {report, files},
                width: '800px'
              });
            },
            error => this.snackBar.open(error.error[0].description, 'Close', {duration: 3000})
          );
        },
        error => this.snackBar.open(error.error[0].description, 'Close', {duration: 3000})
      );
    }
  }

  openReportModal(reportId: number): void {
    this.menteeService.getReportFiles(reportId).subscribe(
      files => {
        this.menteeService.getPeriodicalReport(reportId).subscribe(
          report => {
            const dialogRef = this.dialog.open(ReportDialog, {
              data: {report, files},
              width: '800px'
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result === true) {
                this.loadWorkoutPlans(this.mentee!.userId.keycloakId)
              }
            })
          },
          error => this.snackBar.open(error.error[0].description, 'Close', {duration: 3000})
        );
      },
      error => console.error('Error fetching report files', error)
    );
  }

  deleteWorkoutPlan(workoutPlan: WorkoutPlan): void {
    const dto = {id: workoutPlan.id, version: workoutPlan.version};
    this.menteeService.deleteWorkoutPlan(workoutPlan.id, dto).subscribe({
      next: () => {
        this.snackBar.open('Workout plan deleted successfully!', 'Close', {duration: 3000});
        this.loadWorkoutPlans(this.mentee!.userId.keycloakId);
      },
      error: (err) => {
        this.snackBar.open('Error deleting workout plan: ' + err.error[0].description, 'Close', {duration: 3000});
      }
    });
  }

  activateAccount(): void {
    if (this.mentee) {
      this.menteeService.activateAccount(this.mentee.userId.keycloakId).subscribe({
        next: () => {
          this.snackBar.open('Account activated successfully!', 'OK', {duration: 3000});
          this.mentee!.active = true;
        },
        error: () => {
          this.snackBar.open('Error activating account', 'Close', {duration: 3000});
        }
      });
    }
  }

  deactivateAccount(): void {
    if (this.mentee) {
      this.menteeService.deactivateAccount(this.mentee.userId.keycloakId).subscribe({
        next: () => {
          this.snackBar.open('Account deactivated successfully!', 'OK', {duration: 3000});
          this.mentee!.active = false;
        },
        error: () => {
          this.snackBar.open('Error deactivating account', 'Close', {duration: 3000});
        }
      });
    }
  }
}
