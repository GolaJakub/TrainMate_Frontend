import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {WorkoutsService} from '../../../workouts/workouts.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ExerciseListItemProjection} from '../../../exercises/exercise.data';
import {ExerciseItemCreateDto, TrainingUnitDto, TrainingUnitUpdateDto} from '../../../workouts/workouts.model';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'tm-add-exercise-dialog',
  templateUrl: './add-exercise-to-training-unit.dialog.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    FormsModule
  ],
  styleUrls: ['./add-exercise-to-training-unit.dialog.css']
})
export class AddExerciseToTrainingUnitDialog implements OnInit {
  addExerciseForm: FormGroup;
  searchCriteria: any = {
    name: ''
  };
  isExerciseDropdownOpen: boolean = false;
  filteredExercises: ExerciseListItemProjection[] = [];

  constructor(
    private fb: FormBuilder,
    private workoutsService: WorkoutsService,
    public dialogRef: MatDialogRef<AddExerciseToTrainingUnitDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {
      day: string;
      exercises: ExerciseListItemProjection[];
      workoutPlanId: number;
      currentPage: number;
      trainingUnitId: number;
      version: number
    },
    private snackBar: MatSnackBar
  ) {
    this.addExerciseForm = this.fb.group({
      exerciseId: ['', Validators.required],
      repetitions: [0, Validators.required],
      tempo: ['', Validators.required],
      weight: [0, Validators.required],
      rir: [0, Validators.required],
      sets: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.filteredExercises = this.data.exercises;
  }

  toggleExerciseDropdown() {
    this.isExerciseDropdownOpen = !this.isExerciseDropdownOpen;
  }

  filterExercises() {
    const searchName = this.searchCriteria.name.toLowerCase();
    this.filteredExercises = this.data.exercises.filter(exercise => exercise.name.toLowerCase().includes(searchName));
  }

  selectExercise(exercise: ExerciseListItemProjection) {
    this.addExerciseForm.patchValue({exerciseId: exercise.id});
    this.searchCriteria.name = exercise.name;
    this.isExerciseDropdownOpen = false;
  }

  onSave(): void {
    if (this.addExerciseForm.valid) {
      const exerciseCreateDto: ExerciseItemCreateDto = this.addExerciseForm.value;

      if (this.data.trainingUnitId === 0) {
        const trainingUnitDto: TrainingUnitDto = {
          workoutPlanId: this.data.workoutPlanId,
          dayOfWeek: this.data.day.toUpperCase(),
          weekNumber: this.data.currentPage,
          exerciseCreateDto
        };

        this.workoutsService.createTrainingUnit(trainingUnitDto).subscribe({
          next: (newTrainingUnitId: number) => {
            this.snackBar.open('Exercise added successfully!', 'Close', {duration: 3000});
            this.dialogRef.close('saved');
          },
          error: (err) => {
            this.snackBar.open('Error creating training unit: ' + err.message, 'Close', {duration: 3000});
          }
        });
      } else {
        this.addExerciseToTrainingUnit(this.data.trainingUnitId, exerciseCreateDto);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private addExerciseToTrainingUnit(trainingUnitId: number, exerciseCreateDto: ExerciseItemCreateDto): void {
    const trainingUnitUpdateDto: TrainingUnitUpdateDto = {
      id: trainingUnitId,
      version: this.data.version,
      dayOfWeek: this.data.day.toUpperCase(),
      weekNumber: this.data.currentPage,
      exerciseCreateDto
    };

    this.workoutsService.addExerciseToTrainingUnit(trainingUnitId, trainingUnitUpdateDto).subscribe({
      next: () => {
        this.snackBar.open('Exercise added successfully!', 'Close', {duration: 3000});
        this.dialogRef.close('saved');
      },
      error: (err) => {
        this.snackBar.open('Error adding exercise: ' + err.message, 'Close', {duration: 3000});
      }
    });
  }
}
