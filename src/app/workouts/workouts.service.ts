import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { map, Observable } from 'rxjs';
import {
  TrainingUnitProjection,
  ReportCreateDto,
  ExerciseItemProjection,
  ExerciseReport,
  WorkoutPlanCreateDto, WorkoutPlanProjection, TrainingUnitUpdateDto, TrainingUnitDto, ExerciseItemUpdateDto
} from './workouts.model';
import { WorkoutPlanUpdateDto } from "../mentees/mentees-list/mentee.model";

@Injectable({ providedIn: 'root' })
export class WorkoutsService {
  baseUrl = 'http://localhost:8080/api/tm-core';

  constructor(private httpClient: HttpClient, private oAuthService: OAuthService) {}

  getCurrentTrainingUnits(): Observable<{ [key: string]: ExerciseItemProjection[] }> {
    return this.httpClient.get<TrainingUnitProjection[]>(`${this.baseUrl}/training/current`, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
      }
    }).pipe(
      map(data => this.processTrainingUnits(data))
    );
  }

  private processTrainingUnits(data: TrainingUnitProjection[]): { [key: string]: ExerciseItemProjection[] } {
    return data.reduce((tasks, unit) => {
      const day = this.mapDayOfWeek(unit.dayOfWeek);
      if (!tasks[day]) {
        tasks[day] = [];
      }
      tasks[day].push(...unit.exercises);
      return tasks;
    }, {} as { [key: string]: ExerciseItemProjection[] });
  }

  private mapDayOfWeek(dayOfWeek: string): string {
    switch (dayOfWeek.toUpperCase()) {
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
        return '';
    }
  }

  reportExercise(reportCreateDto: ReportCreateDto): Observable<any> {
    const url = `${this.baseUrl}/exercise/${reportCreateDto.exerciseItemId}/report`;
    return this.httpClient.post(url, reportCreateDto, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
      }
    });
  }

  getExerciseReport(exerciseItemId: number): Observable<ExerciseReport> {
    const url = `${this.baseUrl}/training/exercise/${exerciseItemId}/report`;
    return this.httpClient.get<ExerciseReport>(url, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
      }
    });
  }

  createWorkoutPlan(workoutPlanCreateDto: WorkoutPlanCreateDto): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/workout-plan/create`,
      workoutPlanCreateDto,
      {
        headers: {
          'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
        }
      }
    );
  }

  getTrainingUnits(workoutPlanId: number, week: number): Observable<any> {
    return this.httpClient.get<{ [key: string]: ExerciseItemProjection[] }>(`${this.baseUrl}/training/${workoutPlanId}/get-for-week?week=${week}`,
      {
        headers: {
          'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
        },
      });
  }

  getWorkoutPlanHeader(workoutPlanId: number): Observable<WorkoutPlanProjection> {
    return this.httpClient.get<WorkoutPlanProjection>(`${this.baseUrl}/workout-plan/${workoutPlanId}/header`,
      {
        headers: {
          'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
        },
      });
  }

  addExerciseToTrainingUnit(id: number, trainingUnitDto: TrainingUnitUpdateDto): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/training/${id}/add-exercise`, trainingUnitDto, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
      },
    });
  }

  createTrainingUnit(trainingUnitDto: TrainingUnitDto): Observable<number> {
    return this.httpClient.post<number>(`${this.baseUrl}/training/create`, trainingUnitDto, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
      },
    });
  }

  deleteExerciseItem(exerciseItemId: number, dto: { id: number, version: number }): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/training/exercise/${exerciseItemId}/delete`, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
      },
      body: dto
    });
  }

  updateExerciseItem(id: number, exerciseItemUpdateDto: ExerciseItemUpdateDto): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/training/exercise/${id}/update`, exerciseItemUpdateDto, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
      },
    });
  }

  updateWorkoutPlan(workoutPlanId: number, workoutPlanUpdateDto: WorkoutPlanUpdateDto): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/workout-plan/${workoutPlanId}/update`, workoutPlanUpdateDto, {
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
      },
    });
  }
}
