import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FileStorageDto, PeriodicalReportProjection} from "./reports.model";
import {NgForOf, NgIf} from "@angular/common";
import {ImageDialog} from "./image-dialog/image-dialog.component";
import {MenteeService} from "../../mentees/mentee.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserStateService} from "../../users/user-state.service";

interface Field {
  name: keyof PeriodicalReportProjection;
  label: string;
}

@Component({
  selector: 'app-initial-report-dialog',
  templateUrl: './report-dialog.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  styleUrls: ['./report-dialog.component.css']
})
export class ReportDialog {
  fields: Field[];

  constructor(
    public dialogRef: MatDialogRef<ReportDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { report: PeriodicalReportProjection, files: FileStorageDto[] },
    private dialog: MatDialog,
    private menteeService: MenteeService,
    private snackBar: MatSnackBar,
    private userStateService: UserStateService
  ) {
    this.fields = [
      {name: 'weight', label: 'Weight'},
      {name: 'bodyFat', label: 'Body Fat'},
      {name: 'leftBiceps', label: 'Left Biceps'},
      {name: 'rightBiceps', label: 'Right Biceps'},
      {name: 'leftForearm', label: 'Left Forearm'},
      {name: 'rightForearm', label: 'Right Forearm'},
      {name: 'leftThigh', label: 'Left Thigh'},
      {name: 'rightThigh', label: 'Right Thigh'},
      {name: 'leftCalf', label: 'Left Calf'},
      {name: 'rightCalf', label: 'Right Calf'},
      {name: 'shoulders', label: 'Shoulders'},
      {name: 'chest', label: 'Chest'},
      {name: 'waist', label: 'Waist'},
      {name: 'abdomen', label: 'Abdomen'},
      {name: 'hips', label: 'Hips'}
    ];
  }

  getFieldValue(fieldName: keyof PeriodicalReportProjection): any {
    return this.data.report[fieldName];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  openImageDialog(image: FileStorageDto): void {
    this.dialog.open(ImageDialog, {
      data: image,
      width: '80%',
      maxWidth: '80%',
    });
  }

  onReview(): void {
    const auditDto = {
      id: this.data.report.id,
      version: this.data.report.version
    };
    this.menteeService.reviewPeriodicalReport(this.data.report.id, auditDto).subscribe({
      next: () => {
        this.snackBar.open('Report reviewed successfully!', 'Close', {duration: 3000});
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open('Error reviewing report: ' + err.message, 'Close', {duration: 3000});
      }
    });
  }

  isReviewVisible(): boolean {
    return !(this.data.report.reviewed || this.userStateService.getCurrentUser()?.role === 'MENTEE');
  }
}
