import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {
  ExerciseCreateData,
  ExerciseEditData,
  ExerciseListItemProjection,
  ExerciseSearchCriteria
} from "./exercise.data";
import {Observable} from "rxjs";
import {OAuthService} from "angular-oauth2-oidc";
import {Page} from "../common/page";
import {ExerciseProjection} from "./exercise-details/exercise-details.model";


@Injectable({providedIn: 'root'})
export class ExerciseService {

  baserUrl = 'http://localhost:8080/api/tm-core/exercise';

  constructor(private httpClient: HttpClient, private oAuthService: OAuthService) {
  }

  searchExercises(criteria: ExerciseSearchCriteria): Observable<Page<ExerciseListItemProjection>> {
    const params = new HttpParams()
      .set('page', criteria.page ? criteria.page.toString() : '0')
      .set('size', criteria.pageSize ? criteria.pageSize.toString() : '5')
      .set('sort', criteria.sort ? criteria.sort : 'name,asc');
    return this.httpClient.post<Page<ExerciseListItemProjection>>(`${this.baserUrl}/search`, criteria,{
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
        'Content-Type': 'application/json'
      },
      params: params
    })
  }

  getExerciseById(exerciseId: string | null): Observable<ExerciseProjection> {
    return this.httpClient.get<ExerciseProjection>(`${this.baserUrl}/${exerciseId}`,{
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    })
  }

  updateExercise(exerciseId: number, updatedExercise: ExerciseEditData) {
    return this.httpClient.put<ExerciseProjection>(`${this.baserUrl}/${exerciseId}`, updatedExercise,{
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    })
  }

  addExercise(exerciseFormData: ExerciseCreateData) {
    return this.httpClient.post<ExerciseProjection>(`${this.baserUrl}/create`, exerciseFormData,{
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    })
  }

  deleteExercise(exerciseId: number, auditDto: { id: number, version: number }) {
    return this.httpClient.delete<void>(`${this.baserUrl}/${exerciseId}`,{
      headers: {
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
        'Content-Type': 'application/json'
      },
      body: auditDto
    });
  }
}
