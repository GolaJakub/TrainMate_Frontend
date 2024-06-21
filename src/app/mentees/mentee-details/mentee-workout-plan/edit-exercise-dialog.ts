import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkoutsService } from '../../../workouts/workouts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExerciseListItemProjection } from '../../../exercises/exercise.data';
import {ExerciseItemProjection, ExerciseItemUpdateDto} from '../../../workouts/workouts.model';
import { NgForOf } from "@angular/common";

@Component({
  selector: 'tm-edit-exercise-dialog',
  templateUrl: './edit-exercise.dialog.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    FormsModule
  ],
  styleUrls: ['./add-exercise-to-training-unit.dialog.css']
})
export class EditExerciseDialog implements OnInit {
  editExerciseForm: FormGroup;
  searchCriteria: any = {
    name: ''
  };
  isExerciseDropdownOpen: boolean = false;
  filteredExercises: ExerciseListItemProjection[] = [];

  constructor(
    private fb: FormBuilder,
    private workoutsService: WorkoutsService,
    public dialogRef: MatDialogRef<EditExerciseDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { task: ExerciseItemProjection; exercises: ExerciseListItemProjection[]; workoutPlanId: number; currentPage: number; trainingUnitId: number; version: number; day: string },
    private snackBar: MatSnackBar
  ) {
    this.editExerciseForm = this.fb.group({
      exerciseId: [data.task.exerciseId, Validators.required],
      repetitions: [data.task.repetitions, Validators.required],
      tempo: [data.task.tempo, Validators.required],
      weight: [data.task.weight, Validators.required],
      rir: [data.task.rir, Validators.required],
      sets: [data.task.sets, Validators.required]
    });
  }

  ngOnInit(): void {
    this.filteredExercises = this.data.exercises;
    this.searchCriteria.name = this.data.task.name;
  }

  toggleExerciseDropdown() {
    this.isExerciseDropdownOpen = !this.isExerciseDropdownOpen;
  }

  filterExercises() {
    const searchName = this.searchCriteria.name.toLowerCase();
    this.filteredExercises = this.data.exercises.filter(exercise => exercise.name.toLowerCase().includes(searchName));
  }

  selectExercise(exercise: ExerciseListItemProjection) {
    this.editExerciseForm.patchValue({ exerciseId: exercise.id });
    this.searchCriteria.name = exercise.name;
    this.isExerciseDropdownOpen = false;
  }

  onSave(): void {
    if (this.editExerciseForm.valid) {
      const exerciseUpdateDto: ExerciseItemUpdateDto = {
        id: this.data.task.id,
        version: this.data.task.version,
        trainingUnitId: this.data.trainingUnitId,
        ...this.editExerciseForm.value
      };

      this.workoutsService.updateExerciseItem(this.data.task.id, exerciseUpdateDto).subscribe({
        next: () => {
          this.snackBar.open('Exercise updated successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close('updated');
        },
        error: (err) => {
          this.snackBar.open('Error updating exercise: ' + err.message, 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
