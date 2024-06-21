import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {faCheckCircle, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {MenteeProjection, WorkoutPlan} from "../../mentees/mentees-list/mentee.model";
import {MenteeService} from "../../mentees/mentee.service";
import {ReportDialog} from "../../reports/periodical-report/report-dialog.component";

@Component({
  selector: 'app-mentee-workout-plans',
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './mentee-own-workout-plans-list.component.html',
  styleUrl: './mentee-own-workout-plans-list.component.css'
})
export class MenteeOwnWorkoutPlansListComponent implements OnInit {
  mentee: MenteeProjection | null = null;
  workoutPlans: WorkoutPlan[] = [];
  pageSize = 5;
  currentPage = 0;
  totalPages = 1;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;

  constructor(
    private route: ActivatedRoute,
    private menteeService: MenteeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadWorkoutPlans();
  }

  loadWorkoutPlans(): void {
    this.menteeService.getWorkoutPlansForCurrentlyLoggedUser().subscribe(
      plans => {
        this.workoutPlans = plans;
        this.totalPages = Math.ceil(plans.length / this.pageSize);
      },
      error => console.error('Error fetching workout plans', error)
    );
  }

  // openInitialReportModal(): void {
  //   if (this.mentee) {
  //     this.menteeService.getInitialReport(this.mentee.userId.keycloakId).subscribe(
  //       report => {
  //         this.menteeService.getReportFiles(report.id).subscribe(
  //           files => {
  //             this.dialog.open(ReportDialog, {
  //               data: {report, files},
  //               width: '800px'
  //             });
  //           },
  //           error => console.error('Error fetching report files', error)
  //         );
  //       },
  //       error => console.error('Error fetching initial report', error)
  //     );
  //   }
  // }

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
                this.loadWorkoutPlans()
              }
            })
          },
          error => console.error('Error fetching report', error)
        );
      },
      error => console.error('Error fetching report files', error)
    );
  }

}
