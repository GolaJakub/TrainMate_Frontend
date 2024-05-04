import {Routes} from '@angular/router';
import {ExercisesComponent} from "./exercises/exercises.component";
import {WorkoutsComponent} from "./workouts/workouts.component";
import {DietsComponent} from "./diets/diets.component";
import {UsersComponent} from "./users/users.component";

export const routes: Routes = [
  {'path': 'exercises', component: ExercisesComponent},
  {'path': 'workouts', component: WorkoutsComponent},
  {'path': 'diets', component: DietsComponent},
  {'path': 'users', component: UsersComponent},
];
