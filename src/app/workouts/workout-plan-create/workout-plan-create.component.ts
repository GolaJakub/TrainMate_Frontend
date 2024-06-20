import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { WorkoutsService } from "../workouts.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'tm-workout-plan-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './workout-plan-create.component.html',
  styleUrl: './workout-plan-create.component.css'
})
export class WorkoutPlanCreateComponent implements OnInit {
  workoutPlanForm: FormGroup;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private workoutsService: WorkoutsService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.workoutPlanForm = this.fb.group({
      name: ['', Validators.required],
      userId: ['', Validators.required],
      category: ['', Validators.required],
      startDate: ['', Validators.required],
      durationInWeeks: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('menteeId');
    if (this.userId) {
      this.workoutPlanForm.patchValue({ userId: this.userId });
    }
  }

  isInvalid(controlName: string): boolean | undefined {
    const control = this.workoutPlanForm.get(controlName);
    return control?.invalid && control?.touched;
  }

  onSubmit(): void {
    if (this.workoutPlanForm.valid) {
      this.workoutsService.createWorkoutPlan(this.workoutPlanForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Workout plan created successfully!', 'OK', { duration: 3000 });
          this.router.navigate(['/mentees/mentee-details', this.workoutPlanForm.value.userId]);
        },
        error: (message) => {
          this.snackBar.open('Error creating workout plan', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.workoutPlanForm.markAllAsTouched();
    }
  }

  onComplete(): void {
    if (this.workoutPlanForm.valid) {
      this.workoutsService.createWorkoutPlan(this.workoutPlanForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Workout plan created successfully!', 'OK', { duration: 3000 });
          this.router.navigate(['/workout-plan-details', response.id]);
        },
        error: (message) => {
          this.snackBar.open('Error creating workout plan', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.workoutPlanForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    if (this.userId) {
      this.router.navigate(['/mentees/mentee-details', this.userId]);
    } else {
      this.router.navigate(['/mentees/mentee-details']);
    }
  }
}
