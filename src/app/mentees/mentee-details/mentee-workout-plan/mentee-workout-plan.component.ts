import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {WorkoutsService} from '../../../workouts/workouts.service';
import {
  ExerciseItemProjection,
  ExerciseReport,
  SetParams,
  WorkoutPlanProjection,
} from '../../../workouts/workouts.model';
import {ExerciseDetailDialog} from '../../../workouts/mentee-workouts/mentee-workouts.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ExerciseListItemProjection} from "../../../exercises/exercise.data";
import {AddExerciseToTrainingUnitDialog} from "./add-exercise-to-training-unit.dialog";
import {ExerciseService} from "../../../exercises/exercises.service";
import {EditExerciseDialog} from "./edit-exercise-dialog";
import {ExerciseReportDialog} from "../../../workouts/exercise-report-dialog/exercise-report-dialog.component";
import moment from 'moment';


@Component({
  selector: 'tm-mentee-workouts',
  templateUrl: './mentee-workout-plan.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    FontAwesomeModule,
    NgIf
  ],
  styleUrls: ['./mentee-workout-plan.component.css']
})
export class MenteeWorkoutPlanComponent implements OnInit {
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  tasks: { [key: string]: ExerciseItemProjection[] } = {};
  trainingUnitIds: { [key: string]: number } = {};
  versions: { [key: string]: number } = {};
  selectedTask: ExerciseItemProjection | null = null;
  reportSets: SetParams[] = [];
  reportNotes: string = '';
  expandedSets: { [key: number]: boolean } = {};
  currentPage: number = 1;
  totalWeeks: number = 1;
  workoutPlanId: number = 0;
  workoutPlan: WorkoutPlanProjection | null = null;
  exercises: ExerciseListItemProjection[] = [];
  startDate: moment.Moment | null = null;
  endDate: moment.Moment | null = null;
  startDayOfWeek: number | null = null;
  endDayOfWeek: number | null = null;

  constructor(private workoutsService: WorkoutsService, private route: ActivatedRoute, private snackBar: MatSnackBar, private dialog: MatDialog, private exercisesService: ExerciseService) {
  }

  ngOnInit(): void {
    this.workoutPlanId = Number(this.route.snapshot.paramMap.get('workoutPlanId'));
    this.workoutsService.getWorkoutPlanHeader(this.workoutPlanId).subscribe(header => {
      this.workoutPlan = header;
      this.totalWeeks = this.workoutPlan.duration;

      this.startDate = moment(this.workoutPlan.dateRange.from);
      this.endDate = moment(this.workoutPlan.dateRange.to);

      this.startDayOfWeek = this.startDate.isoWeekday();
      this.endDayOfWeek = this.endDate.isoWeekday();
    });
    this.initializeTasks();
    this.fetchTrainingUnits();
    this.fetchAllExercises();
  }

  initializeTasks(): void {
    this.days.forEach((day) => {
      this.tasks[day] = [];
      this.trainingUnitIds[day] = 0;
      this.versions[day] = 0;
    });
  }

  fetchTrainingUnits(): void {
    if (this.workoutPlanId) {
      this.workoutsService.getTrainingUnits(this.workoutPlanId, this.currentPage).subscribe((data: any[]) => {
        this.initializeTasks();
        data.forEach(dayData => {
          const day = this.convertDayOfWeek(dayData.dayOfWeek);
          if (day) {
            this.tasks[day] = dayData.exercises;
            this.trainingUnitIds[day] = dayData.id;
            this.versions[day] = dayData.version;
          }
        });
      });
    }
  }

  fetchAllExercises(): void {
    this.exercisesService.getAllExercises().subscribe((data: ExerciseListItemProjection[]) => {
      this.exercises = data;
    });
  }

  convertDayOfWeek(dayOfWeek: string): string | null {
    switch (dayOfWeek) {
      case 'MONDAY':
        return 'Monday';
      case 'TUESDAY':
        return 'Tuesday';
      case 'WEDNESDAY':
        return 'Wednesday';
      case 'THURSDAY':
        return 'Thursday';
      case 'FRIDAY':
        return 'Friday';
      case 'SATURDAY':
        return 'Saturday';
      case 'SUNDAY':
        return 'Sunday';
      default:
        return null;
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

  openAddExerciseModal(day: string): void {
    const dialogRef = this.dialog.open(AddExerciseToTrainingUnitDialog, {
      width: '600px',
      data: {
        day,
        exercises: this.exercises,
        workoutPlanId: this.workoutPlanId,
        currentPage: this.currentPage,
        trainingUnitId: this.trainingUnitIds[day],
        version: this.versions[day]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.fetchTrainingUnits();
      }
    });
  }

  editExerciseItem(task: ExerciseItemProjection, day: string): void {
    const dialogRef = this.dialog.open(EditExerciseDialog, {
      width: '600px',
      data: {
        task,
        exercises: this.exercises,
        workoutPlanId: this.workoutPlanId,
        currentPage: this.currentPage,
        trainingUnitId: this.trainingUnitIds[day],
        version: this.versions[day],
        day
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.fetchTrainingUnits();
      }
    });
  }

  deleteExerciseItem(task: ExerciseItemProjection): void {
    const dto = {id: task.id, version: task.version};
    this.workoutsService.deleteExerciseItem(task.id, dto).subscribe({
      next: () => {
        this.snackBar.open('Exercise item deleted successfully!', 'Close', {duration: 3000});
        this.fetchTrainingUnits();
      },
      error: (err) => {
        this.snackBar.open('Error deleting exercise item: ' + err.message, 'Close', {duration: 3000});
      }
    });
  }


  shouldShowAddExerciseButton(dayIndex: number): boolean {
    if (this.currentPage === 1 && this.startDayOfWeek !== null) {
      const adjustedStartDayOfWeek = this.startDayOfWeek - 1;
      return dayIndex >= adjustedStartDayOfWeek;
    }
    if (this.currentPage === this.totalWeeks && this.endDayOfWeek !== null) {
      const adjustedEndDayOfWeek = this.endDayOfWeek - 1;
      return dayIndex <= adjustedEndDayOfWeek;
    }
    return true;
  }
}
