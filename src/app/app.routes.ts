import {Routes} from '@angular/router';
import {ExercisesComponent} from "./exercises/exercises.component";
import {WorkoutsComponent} from "./workouts/workouts.component";
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

export const routes: Routes = [
  { path: '' , component: HomeComponent},
  { path: 'exercises', component: ExercisesComponent, canActivate: [RoleGuard], data: {expectedRole: 'PERSONAL_TRAINER'}},
  { path: 'workouts', component: WorkoutsComponent},
  { path: 'exercises/exercise-details/:id', component: ExerciseDetailsComponent},
  { path: 'exercises/add-exercise', component: ExerciseCreateComponent},
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'periodical-report', component: PeriodicalReportComponent },
  { path: 'personal-data', component: PersonalDataComponent },
  { path: 'my-workouts', component: MenteeWorkoutsComponent },
  { path: 'mentees', component: MenteesListComponent },
  { path: 'mentees/invite-mentee', component: InviteMenteeComponent },
  { path: 'mentees/mentee-details/:id', component: MenteeDetailsComponent },
  { path: 'workout-plan/create/:menteeId', component: WorkoutPlanCreateComponent },
];
