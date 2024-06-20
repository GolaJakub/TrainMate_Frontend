import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ReportDialog} from "../../reports/periodical-report/report-dialog.component";
import {MenteeProjection, WorkoutPlan} from "../mentees-list/mentee.model";
import {MenteeService} from "../mentee.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-mentee-details',
  templateUrl: './mentee-details.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgForOf,
    RouterLink,
    FontAwesomeModule,
    NgClass,
    DatePipe,
    NgIf
  ],
  styleUrls: ['./mentee-details.component.css']
})
export class MenteeDetailsComponent implements OnInit {
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
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.menteeService.getMentee(userId).subscribe(
        mentee => this.mentee = mentee,
        error => console.error('Error fetching mentee details', error)
      );
      this.loadWorkoutPlans(userId);
    }
  }

  loadWorkoutPlans(userId: string): void {
    this.menteeService.getWorkoutPlans(userId).subscribe(
      plans => {
        this.workoutPlans = plans;
        this.totalPages = Math.ceil(plans.length / this.pageSize);
      },
      error => console.error('Error fetching workout plans', error)
    );
  }

  openInitialReportModal(): void {
    if (this.mentee) {
      this.menteeService.getInitialReport(this.mentee.userId.keycloakId).subscribe(
        report => {
          this.menteeService.getReportFiles(report.id).subscribe(
            files => {
              this.dialog.open(ReportDialog, {
                data: { report, files },
                width: '800px'
              });
            },
            error => console.error('Error fetching report files', error)
          );
        },
        error => console.error('Error fetching initial report', error)
      );
    }
  }

  openReportModal(reportId: number): void {
    this.menteeService.getReportFiles(reportId).subscribe(
      files => {
        this.menteeService.getPeriodicalReport(reportId).subscribe(
          report => {
            const dialogRef = this.dialog.open(ReportDialog, {
              data: { report, files },
              width: '800px'
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result === true) {
                this.loadWorkoutPlans(this.mentee!.userId.keycloakId)
              }
            })
          },
          error => console.error('Error fetching report', error)
        );
      },
      error => console.error('Error fetching report files', error)
    );
  }

  range(totalPages: number): number[] {
    return Array(totalPages).fill(0).map((x, i) => i);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.totalPages = Math.ceil(this.workoutPlans.length / this.pageSize);
    if (this.currentPage >= this.totalPages) {
      this.currentPage = this.totalPages - 1;
    }
  }

  addWorkoutPlan(menteeId: string): void {
    this.router.navigate(['/workout-plan/create', menteeId]);
  }
}
