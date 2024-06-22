import {Component, Inject, OnInit} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {WorkoutsService} from '../workouts.service';
import {Router} from '@angular/router';
import {ExerciseItemProjection, ExerciseReport, SetParams} from '../workouts.model';
import {FormsModule} from '@angular/forms';
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {SafePipe} from "../../common/safe.pipe";
import {ExerciseReportDialog} from "../exercise-report-dialog/exercise-report-dialog.component";

@Component({
  selector: 'tm-mentee-workouts',
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgForOf,
    FormsModule,
    NgIf,
    NgClass,
  ],
  templateUrl: './mentee-workouts.component.html',
  styleUrls: ['./mentee-workouts.component.css'],
})
export class MenteeWorkoutsComponent implements OnInit {
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  tasks: { [key: string]: ExerciseItemProjection[] } = {};
  selectedTask: ExerciseItemProjection | null = null;
  reportSets: SetParams[] = [];
  reportNotes: string = '';
  expandedSets: { [key: number]: boolean } = {};

  constructor(private workoutsService: WorkoutsService, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.initializeTasks();
    this.fetchTrainingUnits();
  }

  initializeTasks(): void {
    this.days.forEach((day) => {
      this.tasks[day] = [];
    });
  }

  fetchTrainingUnits(): void {
    this.workoutsService.getCurrentTrainingUnits().subscribe((data: { [key: string]: ExerciseItemProjection[] }) => {
      this.tasks = data;
    });
  }

  onTaskClick(task: ExerciseItemProjection): void {
    this.dialog.open(ExerciseDetailDialog, {
      data: task,
      width: '600px'
    });
  }

  openReportModal(task: ExerciseItemProjection): void {
    this.selectedTask = task;
    this.expandedSets = {};
    if (task.reported) {
      this.workoutsService.getExerciseReport(task.id).subscribe((report: ExerciseReport) => {
        this.reportSets = report.reportedSets;
        this.reportNotes = report.remarks;
        this.dialog.open(ExerciseReportDialog, {
          data: {
            task,
            reportSets: this.reportSets,
            reportNotes: this.reportNotes,
            closeReportModal: () => this.closeReportModal(),
            fetchTrainingUnits: () => this.fetchTrainingUnits(),
            snackBar: this.snackBar,
            version: report.version
          },
          width: '600px'
        });
      });
    } else {
      this.reportSets = Array(task.sets)
        .fill(0)
        .map((_, index) => ({
          reportedWeight: 0,
          reportedRepetitions: 0,
          reportedRir: 0,
          set: index + 1,
        }));
      this.reportNotes = '';
      this.dialog.open(ExerciseReportDialog, {
        data: {
          task,
          reportSets: this.reportSets,
          reportNotes: this.reportNotes,
          closeReportModal: () => this.closeReportModal(),
          fetchTrainingUnits: () => this.fetchTrainingUnits(),
          snackBar: this.snackBar,
          version: 0
        },
        width: '600px'
      });
    }
  }

  closeReportModal(): void {
    this.selectedTask = null;
    this.reportNotes = '';
  }
}

@Component({
  selector: 'exercise-detail-dialog',
  template: `
    <div class="custom-dialog-container">
      <h2 class="custom-dialog-title">Exercise Details</h2>
      <div class="custom-dialog-content">
        <div class="row mb-3">
          <div class="col-md-3"><strong>Exercise name:</strong></div>
          <div class="col-md-9">{{ data.name }}</div>
        </div>
        <div class="row mb-3">
          <div class="col-md-3"><strong>Muscle involved:</strong></div>
          <div class="col-md-9">{{ data.muscleInvolved }}</div>
        </div>
        <div class="row mb-3">
          <div class="col-md-3"><strong>Description:</strong></div>
          <div class="col-md-9">{{ data.description }}</div>
        </div>
        <div class="row mb-3">
          <div class="col-md-3"><strong>Video tutorial:</strong></div>
          <div class="col-md-9">
            <iframe *ngIf="isExerciseUrlValid(data.url)" [src]="data.url | safe" class="w-100" height="315"></iframe>
            <div *ngIf="!isExerciseUrlValid(data.url)">
              Exercise url is not correct
            </div>
          </div>
        </div>
      </div>
      <div class="custom-dialog-actions">
        <button mat-button mat-dialog-close class="button">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .custom-dialog-container {
      background-color: #fff; /* Dopasowany kolor tła */
      color: #000; /* Kolor tekstu */
      border-radius: 8px;
      padding: 20px;
    }

    .custom-dialog-title {
      color: #fff; /* Kolor tekstu tytułu */
      background-color: #333; /* Kolor tła tytułu */
      padding: 10px;
      border-radius: 6px 6px 0 0;
    }

    .custom-dialog-content {
      padding: 20px;
    }

    .custom-dialog-actions {
      display: flex;
      justify-content: flex-end;
      padding: 10px 0 0 0;
      .button {
        color: #fff;
        background-color: #333;
      }
    }
  `],
  imports: [
    SafePipe,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    NgIf,
    MatDialogContent,
    MatDialogTitle
  ],
  standalone: true
})
export class ExerciseDetailDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ExerciseItemProjection) {
  }

  isExerciseUrlValid(url: string): boolean {
    // Implement validation logic here
    return true;
  }
}


