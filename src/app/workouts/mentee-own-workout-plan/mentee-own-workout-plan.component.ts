import {Component, OnInit} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgClass, NgForOf} from "@angular/common";
import {ExerciseItemProjection, ExerciseReport, SetParams, WorkoutPlanProjection} from "../workouts.model";
import {ExerciseListItemProjection} from "../../exercises/exercise.data";
import {WorkoutsService} from "../workouts.service";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ExerciseService} from "../../exercises/exercises.service";
import {ExerciseDetailDialog} from "../mentee-workouts/mentee-workouts.component";
import {ExerciseReportDialog} from "../exercise-report-dialog/exercise-report-dialog.component";

@Component({
  selector: 'app-mentee-own-workout-plan',
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgForOf,
    NgClass
  ],
  templateUrl: './mentee-own-workout-plan.component.html',
  styleUrl: './mentee-own-workout-plan.component.css'
})
export class MenteeOwnWorkoutPlanComponent  implements OnInit {
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  tasks: { [key: string]: ExerciseItemProjection[] } = {};
  trainingUnitIds: { [key: string]: number } = {}; // Nowy obiekt do przechowywania trainingUnitId dla każdego dnia
  versions: { [key: string]: number } = {}; // Nowy obiekt do przechowywania version dla każdego dnia
  selectedTask: ExerciseItemProjection | null = null;
  reportSets: SetParams[] = [];
  reportNotes: string = '';
  expandedSets: { [key: number]: boolean } = {};
  currentPage: number = 1;
  totalWeeks: number = 1;
  workoutPlanId: number = 0;
  workoutPlan: WorkoutPlanProjection | null = null;
  exercises: ExerciseListItemProjection[] = [];

  constructor(private workoutsService: WorkoutsService, private route: ActivatedRoute, private snackBar: MatSnackBar, private dialog: MatDialog, private exercisesService: ExerciseService) {}

  ngOnInit(): void {
    this.workoutPlanId = Number(this.route.snapshot.paramMap.get('workoutPlanId'));
    this.workoutsService.getWorkoutPlanHeader(this.workoutPlanId).subscribe(header => {
      this.workoutPlan = header;
      this.totalWeeks = this.workoutPlan.duration;
    });
    this.initializeTasks();
    this.fetchTrainingUnits();
  }

  initializeTasks(): void {
    this.days.forEach((day) => {
      this.tasks[day] = [];
      this.trainingUnitIds[day] = 0; // Inicjalizuj trainingUnitId dla każdego dnia
      this.versions[day] = 0; // Inicjalizuj version dla każdego dnia
    });
  }

  fetchTrainingUnits(): void {
    if (this.workoutPlanId) {
      this.workoutsService.getTrainingUnits(this.workoutPlanId, this.currentPage).subscribe((data: any[]) => {
        this.initializeTasks(); // Clear existing tasks
        data.forEach(dayData => {
          const day = this.convertDayOfWeek(dayData.dayOfWeek);
          if (day) {
            this.tasks[day] = dayData.exercises;
            this.trainingUnitIds[day] = dayData.id; // Przypisz trainingUnitId dla każdego dnia
            this.versions[day] = dayData.version; // Przypisz version dla każdego dnia
          }
        });
      });
    }
  }

  convertDayOfWeek(dayOfWeek: string): string | null {
    switch(dayOfWeek) {
      case 'MONDAY': return 'Monday';
      case 'TUESDAY': return 'Tuesday';
      case 'WEDNESDAY': return 'Wednesday';
      case 'THURSDAY': return 'Thursday';
      case 'FRIDAY': return 'Friday';
      case 'SATURDAY': return 'Saturday';
      case 'SUNDAY': return 'Sunday';
      default: return null;
    }
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

  range(totalWeeks: number): number[] {
    return Array(totalWeeks).fill(0).map((x, i) => i);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalWeeks) {
      this.currentPage = page;
      this.fetchTrainingUnits();
    }
  }
}
