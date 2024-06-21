import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, withPreloading} from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { WorkoutsService } from "../workouts.service";
import { NgIf } from "@angular/common";

@Component({
  selector: 'tm-workout-plan-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './workout-plan-create.component.html',
  styleUrls: ['./workout-plan-create.component.css']
})
export class WorkoutPlanCreateComponent implements OnInit {
  workoutPlanForm: FormGroup;
  userId: string | null = null;
  workoutPlanId: number | null = null;
  version: number | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private workoutsService: WorkoutsService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.workoutPlanForm = this.fb.group({
      name: ['', Validators.required],
      userId: [''],
      category: ['', Validators.required],
      startDate: ['', Validators.required],
      durationInWeeks: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('menteeId');
    this.workoutPlanId = Number(this.route.snapshot.paramMap.get('workoutPlanId'));

    if (this.userId) {
      this.workoutPlanForm.patchValue({ userId: this.userId });
    }

    if (this.workoutPlanId) {
      this.isEditMode = true;
      this.loadWorkoutPlan(this.workoutPlanId);
    }
  }

  loadWorkoutPlan(workoutPlanId: number): void {
    this.workoutsService.getWorkoutPlanHeader(workoutPlanId).subscribe(
      (workoutPlan) => {
        this.workoutPlanForm.patchValue({
          name: workoutPlan.name,
          category: workoutPlan.category,
          startDate: workoutPlan.dateRange.from,
          durationInWeeks: workoutPlan.duration,
        });
        this.version = workoutPlan.version;
      },
      (error) => {
        this.snackBar.open('Error loading workout plan', 'Close', { duration: 3000 });
      }
    );
  }

  isInvalid(controlName: string): boolean | undefined {
    const control = this.workoutPlanForm.get(controlName);
    return control?.invalid && control?.touched;
  }

  onSubmit(): void {
    debugger;

    if (this.workoutPlanForm.valid) {
      if (this.isEditMode) {
        debugger;
        const updateDto = {
          id: this.workoutPlanId,
          version: this.version,
          ...this.workoutPlanForm.value,

        }
        this.workoutsService.updateWorkoutPlan(this.workoutPlanId!, updateDto).subscribe({
          next: () => {
            this.snackBar.open('Workout plan updated successfully!', 'OK', { duration: 3000 });
            window.history.back();
          },
          error: (message) => {
            this.snackBar.open('Error updating workout plan: ' + message.error[0].description, 'Close', { duration: 3000 });
          }
        });
      } else {
        this.workoutsService.createWorkoutPlan(this.workoutPlanForm.value).subscribe({
          next: (response) => {
            this.snackBar.open('Workout plan created successfully!', 'OK', { duration: 3000 });
            this.router.navigate(['/mentees/mentee-details', this.workoutPlanForm.value.userId]);
          },
          error: () => {
            this.snackBar.open('Error creating workout plan', 'Close', { duration: 3000 });
          }
        });
      }
    } else {
      this.workoutPlanForm.markAllAsTouched();
    }
  }

  onComplete(): void {
    if (this.workoutPlanForm.valid) {
      if (this.isEditMode) {
        this.workoutsService.updateWorkoutPlan(this.workoutPlanId!, this.workoutPlanForm.value).subscribe({
          next: () => {
            this.snackBar.open('Workout plan updated successfully!', 'OK', { duration: 3000 });
            this.router.navigate(['/workout-plan-details', this.workoutPlanId]);
          },
          error: () => {
            this.snackBar.open('Error updating workout plan', 'Close', { duration: 3000 });
          }
        });
      } else {
        this.workoutsService.createWorkoutPlan(this.workoutPlanForm.value).subscribe({
          next: (response) => {
            this.snackBar.open('Workout plan created successfully!', 'OK', { duration: 3000 });
            this.router.navigate(['/workout-plan-details', response.value]);
          },
          error: () => {
            this.snackBar.open('Error creating workout plan', 'Close', { duration: 3000 });
          }
        });
      }
    } else {
      this.workoutPlanForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    window.history.back();
  }
}
