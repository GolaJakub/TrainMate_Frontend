import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OAuthService} from 'angular-oauth2-oidc';
import {map, Observable} from 'rxjs';
import {
  TrainingUnitProjection,
  ReportCreateDto,
  ExerciseItemProjection,
  ExerciseReport,
  WorkoutPlanCreateDto
} from './workouts.model';

@Injectable({providedIn: 'root'})
export class WorkoutsService {
  baseUrl = 'http://localhost:8080/api/tm-core';

  constructor(private httpClient: HttpClient, private oAuthService: OAuthService) {
  }

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
}
