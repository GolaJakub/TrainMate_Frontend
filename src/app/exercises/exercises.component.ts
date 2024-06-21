import { Component, OnInit } from '@angular/core';
import { ExerciseService } from "./exercises.service";
import { ExerciseListItemProjection } from "./exercise.data";
import { CommonModule, NgForOf } from "@angular/common";
import { Muscle, MuscleGroup, muscleGroupsValues, muscleToMuscleGroupMap } from "./muscles/muscles.data";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'tm-exercises',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgForOf,
    RouterLink,
    CommonModule
  ],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.css'
})
export class ExercisesComponent implements OnInit {

  exercises?: ExerciseListItemProjection[];
  totalPages: number = 10;
  pageSize: number = 5;
  page?: number;
  currentPage: number = 0;

  searchCriteria: any = {
    name: null,
    muscle: null,
    muscleGroup: null
  };

  isMuscleGroupDropdownOpen: boolean = false;
  isMuscleDropdownOpen: boolean = false;

  filteredMuscleGroups: MuscleGroup[] = [];
  filteredMuscles: Muscle[] = [];

  constructor(private exerciseService: ExerciseService) { }

  ngOnInit(): void {
    this.loadExercises();
    this.filteredMuscleGroups = [null as any as MuscleGroup].concat(muscleGroupsValues); // Add null as "ALL"
  }

  onSearchButtonClick(): void {
    this.loadExercises();
  }

  loadExercises(): void {
    this.exerciseService.searchExercises(this.searchCriteria).subscribe(value => {
      this.exercises = value.content;
      this.totalPages = value.totalPages;
    })
  }

  getMusclesByMuscleGroup(muscleGroup: MuscleGroup | string): Muscle[] {
    if (!muscleGroup) {
      return Array.from(muscleToMuscleGroupMap.keys());
    } else {
      return Array.from(muscleToMuscleGroupMap.keys()).filter(muscle => muscleToMuscleGroupMap.get(muscle) === muscleGroup);
    }
  }

  filterMuscleGroups() {
    this.filteredMuscleGroups = [null as any as MuscleGroup].concat(
      muscleGroupsValues.filter(name => !this.searchCriteria.muscleGroup || name.toLowerCase().includes(this.searchCriteria.muscleGroup.toLowerCase()))
    );
  }

  filterMuscles() {
    const muscles = this.getMusclesByMuscleGroup(this.searchCriteria.muscleGroup);
    this.filteredMuscles = [null as any as Muscle].concat(
      muscles.filter(muscle => !this.searchCriteria.muscle || muscle.toLowerCase().includes(this.searchCriteria.muscle.toLowerCase()))
    );
  }

  toggleMuscleGroupDropdown() {
    this.isMuscleGroupDropdownOpen = !this.isMuscleGroupDropdownOpen;
  }

  toggleMuscleDropdown() {
    this.isMuscleDropdownOpen = !this.isMuscleDropdownOpen;
  }

  selectMuscleGroup(muscleGroup: MuscleGroup | null) {
    this.searchCriteria.muscleGroup = muscleGroup;
    this.isMuscleGroupDropdownOpen = false;
    this.filterMuscles();
  }

  selectMuscle(muscle: Muscle | null) {
    this.searchCriteria.muscle = muscle;
    this.isMuscleDropdownOpen = false;
  }

  range(n: number) {
    return Array(n).fill(0).map((x, i) => i + 1);
  }

  onPageChange(i: number) {
    if (i !== this.totalPages && i >= 0) {
      this.currentPage = i;
      this.searchCriteria.page = this.currentPage;
      this.searchCriteria.pageSize = this.pageSize;
      this.loadExercises();
    }
  }

  onPageSizeChange(newPageSize: number) {
    this.pageSize = newPageSize;
    this.currentPage = 0;
    this.searchCriteria.pageSize = this.pageSize;
    this.searchCriteria.page = this.currentPage;
    this.loadExercises();
  }

  protected readonly muscleGroupsValues = muscleGroupsValues;
}
