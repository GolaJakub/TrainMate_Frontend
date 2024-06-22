import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {OAuthService} from 'angular-oauth2-oidc';
import {FileStorageDto, PeriodicalReportProjection} from "../../reports/periodical-report/reports.model";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {ImageDialog} from "../../reports/periodical-report/image-dialog/image-dialog.component";
import {ActivatedRoute} from "@angular/router";

interface Field {
  name: keyof PeriodicalReportProjection;
  label: string;
}

@Component({
  selector: 'app-mentee-progress',
  standalone: true,
  templateUrl: './mentee-progress.component.html',
  imports: [
    NgForOf,
    NgIf,
    DatePipe
  ],
  styleUrls: ['./mentee-progress.component.css']
})
export class MenteeProgressComponent implements OnInit {
  fields: Field[] = [
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
    {name: 'hips', label: 'Hips'},
  ];

  reports: PeriodicalReportProjection[] = [];
  leftSelectedReport: PeriodicalReportProjection | null = null;
  rightSelectedReport: PeriodicalReportProjection | null = null;
  leftFiles: FileStorageDto[] = [];
  rightFiles: FileStorageDto[] = [];
  baseUrl = 'http://localhost:8080/api/tm-core';
  menteeId?: string | null;


  constructor(
    private http: HttpClient,
    private oAuthService: OAuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.menteeId = this.route.snapshot.paramMap.get('menteeId');
    this.fetchReports();
  }

  fetchReports(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
      'Content-Type': 'application/json'
    });

    if (this.menteeId) {
      this.http.get<PeriodicalReportProjection[]>(`${this.baseUrl}/periodical/${this.menteeId}/all-reports`, {headers}).subscribe({
        next: (reports) => {
          this.reports = reports;
          if (reports.length > 0) {
            this.loadInitialReports(reports);
          }
        },
        error: (err) => {
          this.snackBar.open('Error fetching reports: ' + err.message, 'Close', {duration: 3000});
        },
      });
    } else {
      this.http.get<PeriodicalReportProjection[]>(`${this.baseUrl}/periodical/all-reports`, {headers}).subscribe({
        next: (reports) => {
          this.reports = reports;
          if (reports.length > 0) {
            this.loadInitialReports(reports);
          }
        },
        error: (err) => {
          this.snackBar.open('Error fetching reports: ' + err.message, 'Close', {duration: 3000});
        },
      });
    }


  }

  loadInitialReports(reports: PeriodicalReportProjection[]): void {
    this.onLeftReportChangeById(reports[0].id);
    if (reports.length > 1) {
      this.onRightReportChangeById(reports[1].id);
    }
  }

  onLeftReportChange(event: Event): void {
    const reportId = Number((event.target as HTMLSelectElement).value);
    this.onLeftReportChangeById(reportId);
  }

  onRightReportChange(event: Event): void {
    const reportId = Number((event.target as HTMLSelectElement).value);
    this.onRightReportChangeById(reportId);
  }

  onLeftReportChangeById(reportId: number): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
      'Content-Type': 'application/json'
    });

    this.http.get<PeriodicalReportProjection>(`${this.baseUrl}/periodical/${reportId}`, {headers}).subscribe({
      next: (report) => {
        this.leftSelectedReport = report;
        this.fetchFiles(report.id, 'left');
      },
      error: (err) => {
        this.snackBar.open('Error fetching report: ' + err.message, 'Close', {duration: 3000});
      },
    });
  }

  onRightReportChangeById(reportId: number): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
      'Content-Type': 'application/json'
    });

    this.http.get<PeriodicalReportProjection>(`${this.baseUrl}/periodical/${reportId}`, {headers}).subscribe({
      next: (report) => {
        this.rightSelectedReport = report;
        this.fetchFiles(report.id, 'right');
      },
      error: (err) => {
        this.snackBar.open('Error fetching report: ' + err.message, 'Close', {duration: 3000});
      },
    });
  }

  fetchFiles(reportId: number, side: 'left' | 'right'): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
      'Content-Type': 'application/json'
    });

    this.http.get<FileStorageDto[]>(`${this.baseUrl}/file/${reportId}/get-all`, {headers}).subscribe({
      next: (files) => {
        if (side === 'left') {
          this.leftFiles = files;
        } else {
          this.rightFiles = files;
        }
      },
      error: (err) => {
        this.snackBar.open('Error fetching files: ' + err.message, 'Close', {duration: 3000});
      },
    });
  }

  getFilteredReports(side: 'left' | 'right'): PeriodicalReportProjection[] {
    if (side === 'left' && this.rightSelectedReport) {
      return this.reports.filter(report => report.id !== this.rightSelectedReport!.id);
    } else if (side === 'right' && this.leftSelectedReport) {
      return this.reports.filter(report => report.id !== this.leftSelectedReport!.id);
    }
    return this.reports;
  }

  getFieldValue(report: PeriodicalReportProjection, fieldName: keyof PeriodicalReportProjection): any {
    return report[fieldName];
  }

  openImageDialog(image: FileStorageDto): void {
    this.dialog.open(ImageDialog, {
      data: image,
      width: '80%',
      maxWidth: '80%',
    });
  }
}
