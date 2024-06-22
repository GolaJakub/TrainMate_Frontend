import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ExerciseService } from '../exercises.service';
import { ExerciseProjection } from './exercise-details.model';
import { SafePipe } from '../../common/safe.pipe';
import { Muscle } from '../muscles/muscles.data';
import {UserStateService} from "../../users/user-state.service";

@Component({
  selector: 'tm-exercise-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    SafePipe,
    RouterLink,
    MatSnackBarModule
  ],
  templateUrl: './exercise-details.component.html',
  styleUrls: ['./exercise-details.component.css']
})
export class ExerciseDetailsComponent implements OnInit {
  exercise!: ExerciseProjection;
  editMode = false;
  exerciseForm!: FormGroup;
  muscles = Object.values(Muscle);

  constructor(
    private route: ActivatedRoute,
    private exerciseService: ExerciseService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private userStateService: UserStateService
  ) {}

  ngOnInit(): void {
    this.loadExercise();
  }

  loadExercise(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.exerciseService.getExerciseById(id).subscribe(value => {
        this.exercise = value;
        this.initForm();
      });
    }
  }

  initForm(): void {
    this.exerciseForm = this.fb.group({
      name: [this.exercise.name, Validators.required],
      muscleInvolved: [this.exercise.muscleInvolved],
      description: [this.exercise.description, Validators.required],
      url: [this.exercise.url]
    });
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.initForm();
    }
  }

  save(): void {
    if (this.exerciseForm.valid) {
      const updatedExercise = {
        ...this.exercise,
        ...this.exerciseForm.value
      };

      this.exerciseService.updateExercise(this.exercise.id, updatedExercise).subscribe({
        next: () => {
          this.snackBar.open('Exercise updated successfully!', 'Close', { duration: 3000 });
          this.exercise = updatedExercise;
          this.editMode = false;
          this.loadExercise();
        },
        error: (message) => {
          this.snackBar.open(message.error[0].description, 'Close', { duration: 3000 });
        }
      });
    } else {
      this.markAllAsTouched();
    }
  }

  delete(): void {
    const auditDto = {
      id: this.exercise.id,
      version: this.exercise.version
    }
      this.exerciseService.deleteExercise(this.exercise.id, auditDto).subscribe({
        next: () => {
          this.snackBar.open('Exercise deleted successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/exercises']);
        },
        error: (message) => {
          this.snackBar.open(message.error[0].description, 'Close', { duration: 3000 });
        }
      });

  }

  markAllAsTouched(): void {
    this.exerciseForm.markAllAsTouched();
  }

  cancel(): void {
    this.editMode = false;
    this.initForm();
  }

  isExerciseUrlValid(exerciseUrl: string): boolean {
    const regex = /^https:\/\/www\.youtube\.com\/embed\/.*/;
    return regex.test(exerciseUrl);
  }
}
