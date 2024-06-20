// import {AfterViewInit, Component, OnInit} from '@angular/core';
// import {UsersService} from "./users.service";
// import {UserData} from "./user-data.model";
// import {NgForOf, NgIf} from "@angular/common";
// import {RouterLink} from "@angular/router";
// import {ReactiveFormsModule} from "@angular/forms";
// import {ExerciseListItemProjection} from "../exercises/exercise.data";
// import {ExerciseService} from "../exercises/exercises.service";
// import {Muscle, MuscleGroup, muscleToMuscleGroupMap} from "../exercises/muscles/muscles.data";
//
// @Component({
//   selector: 'tm-users',
//   standalone: true,
//   imports: [
//     NgIf,
//     RouterLink,
//     NgForOf,
//     ReactiveFormsModule
//   ],
//   templateUrl: './users.component.html',
//   styleUrl: './users.component.css'
// })
// export class UsersComponent implements OnInit {
//
//   users?: ExerciseListItemProjection[];
//   totalPages: number = 10;
//   pageSize: number = 5;
//   page?: number;
//   currentPage: number = 0;
//
//   searchCriteria: any = {
//     name: null,
//     muscle: null,
//     muscleGroup: null
//   };
//
//
//   constructor(private exerciseService: ExerciseService) {
//
//   }
//
//   // ngOnInit(): void {
//   //   this.loadExercises();
//   //
//   // }
//   //
//   // onSearchButtonClick(): void {
//   //   this.loadExercises();
//   // }
//   //
//   // loadExercises(): void {
//   //   this.exerciseService.searchExercises(this.searchCriteria).subscribe(value => {
//   //     this.exercises = value.content;
//   //     this.totalPages = value.totalPages;
//   //   })
//   // }
//   //
//   // getMusclesByMuscleGroup(muscleGroup: MuscleGroup): Muscle[] {
//   //   if (!muscleGroup) {
//   //     return Array.from(muscleToMuscleGroupMap.keys());
//   //   } else {
//   //     return Array.from(muscleToMuscleGroupMap.keys()).filter(muscle => muscleToMuscleGroupMap.get(muscle) === muscleGroup);
//   //   }
//   // }
//   //
//   // range(n: number) {
//   //   return Array(n).fill(0).map((x, i) => i + 1);
//   // }
//   //
//   // onPageChange(i: number) {
//   //   if (i !== this.totalPages && i >= 0) {
//   //     this.currentPage = i;
//   //     this.searchCriteria.page = this.currentPage;
//   //     this.searchCriteria.pageSize = this.pageSize;
//   //     this.loadExercises();
//   //   }
//   // }
//   //
//   // onPageSizeChange(newPageSize: number) {
//   //   this.pageSize = newPageSize;
//   //   this.currentPage = 0;
//   //   this.searchCriteria.pageSize = this.pageSize;
//   //   this.searchCriteria.page = this.currentPage;
//   //   this.loadExercises();
//   // }
//
// }
