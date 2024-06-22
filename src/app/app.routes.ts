import {Routes} from '@angular/router';
import {ExercisesComponent} from "./exercises/exercises.component";
import {ExerciseDetailsComponent} from "./exercises/exercise-details/exercise-details.component";
import {ExerciseCreateComponent} from "./exercises/exercise-create/exercise-create.component";
import {AccessDeniedComponent} from "./common/access-denied/access-denied.component";
import {RoleGuard} from "./common/role-guard";
import {HomeComponent} from "./home/home.component";
import {PeriodicalReportComponent} from "./reports/periodical-report/periodical-report.component";
import {PersonalDataComponent} from "./users/personal-data/personal-data.component";
import {MenteeWorkoutsComponent} from "./workouts/mentee-workouts/mentee-workouts.component";
import {MenteesListComponent} from "./mentees/mentees-list/mentees-list.component";
import {InviteMenteeComponent} from "./mentees/invite-mentee/invite-mentee.component";
import {MenteeDetailsComponent} from "./mentees/mentee-details/mentee-details.component";
import {WorkoutPlanCreateComponent} from "./workouts/workout-plan-create/workout-plan-create.component";
import {MenteeWorkoutPlanComponent} from "./mentees/mentee-details/mentee-workout-plan/mentee-workout-plan.component";
import {
  MenteeOwnWorkoutPlansListComponent
} from "./workouts/mentee-workout-plans/mentee-own-workout-plans-list.component";
import {MenteeOwnWorkoutPlanComponent} from "./workouts/mentee-own-workout-plan/mentee-own-workout-plan.component";
import {MenteeProgressComponent} from "./mentees/mentee-progress/mentee-progress.component";

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'exercises',
    component: ExercisesComponent,
    canActivate: [RoleGuard],
    data: {expectedRole: 'PERSONAL_TRAINER'}
  },
  {path: 'exercises/exercise-details/:id', component: ExerciseDetailsComponent},
  {path: 'exercises/add-exercise', component: ExerciseCreateComponent},
  {path: 'access-denied', component: AccessDeniedComponent},
  {path: 'periodical-report', component: PeriodicalReportComponent},
  {path: 'periodical-report/:workoutPlanId', component: PeriodicalReportComponent},
  {path: 'periodical-report/:workoutPlanId/:reportId', component: PeriodicalReportComponent},
  {path: 'personal-data', component: PersonalDataComponent},
  {path: 'my-workouts', component: MenteeOwnWorkoutPlansListComponent},
  {path: 'current-workout', component: MenteeWorkoutsComponent},
  {
    path: 'mentees',
    component: MenteesListComponent,
    canActivate: [RoleGuard],
    data: {expectedRole: 'PERSONAL_TRAINER'}
  },
  {
    path: 'mentees/invite-mentee',
    component: InviteMenteeComponent,
    canActivate: [RoleGuard],
    data: {expectedRole: 'PERSONAL_TRAINER'}
  },
  {
    path: 'mentees/mentee-details/:id',
    component: MenteeDetailsComponent,
    canActivate: [RoleGuard],
    data: {expectedRole: 'PERSONAL_TRAINER'}
  },
  {
    path: 'workout-plan/create/:menteeId',
    component: WorkoutPlanCreateComponent,
    canActivate: [RoleGuard],
    data: {expectedRole: 'PERSONAL_TRAINER'}
  },
  {
    path: 'workout-plan/edit/:workoutPlanId',
    component: WorkoutPlanCreateComponent,
    canActivate: [RoleGuard],
    data: {expectedRole: 'PERSONAL_TRAINER'}
  },
  {
    path: 'workout-plan-details/:workoutPlanId',
    component: MenteeWorkoutPlanComponent,
    canActivate: [RoleGuard],
    data: {expectedRole: 'PERSONAL_TRAINER'}
  },
  {path: 'mentee-workout-plan-details/:workoutPlanId', component: MenteeOwnWorkoutPlanComponent},
  {path: 'my-progress', component: MenteeProgressComponent},
  {path: 'mentee-progress/:menteeId', component: MenteeProgressComponent},
];
