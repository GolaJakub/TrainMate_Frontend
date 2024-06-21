import {Component, Inject} from "@angular/core";
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ExerciseItemProjection, ReportCreateDto, SetParams} from "../workouts.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {WorkoutsService} from "../workouts.service";
import {UserStateService} from "../../users/user-state.service";

@Component({
  selector: 'exercise-report-dialog',
  templateUrl: 'exercise-report-dialog.component.html',
  styleUrls: ['exercise-report-dialog.component.css'],
  imports: [
    MatButton,
    MatDialogClose,
    FormsModule,
    NgClass,
    NgForOf,
    NgIf
  ],
  standalone: true
})
export class ExerciseReportDialog {
  expandedSets: { [key: number]: boolean } = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    task: ExerciseItemProjection,
    reportSets: SetParams[],
    reportNotes: string,
    closeReportModal: () => void,
    fetchTrainingUnits: () => void,
    snackBar: MatSnackBar,
    version: number
  }, private dialogRef: MatDialogRef<ExerciseReportDialog>, private workoutsService: WorkoutsService, private userStateService: UserStateService) {
  }

  toggleSet(index: number): void {
    this.expandedSets[index] = !this.expandedSets[index];
  }

  submitReport(): void {
    const reportCreateDto: ReportCreateDto = {
      exerciseItemId: this.data.task.id,
      sets: this.data.reportSets,
      remarks: this.data.reportNotes,
      version: this.data.version
    };

    this.workoutsService.reportExercise(reportCreateDto).subscribe({
      next: () => {
        this.data.snackBar.open('Report submitted successfully!', 'Close', {duration: 3000});
        this.data.closeReportModal();
        this.data.fetchTrainingUnits();
        this.dialogRef.close();
      },
      error: (message) => {
        this.data.snackBar.open(message.error[0].description, 'Close', {duration: 3000});
      }
    });
  }

  isMentee(): boolean | undefined {
    return this.userStateService.getCurrentUser()?.role === 'MENTEE';
  }
}
