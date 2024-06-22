import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Muscle} from "../muscles/muscles.data";
import {ExerciseService} from "../exercises.service";
import {Router, RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'tm-exercise-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    RouterLink,
    NgIf
  ],
  templateUrl: './exercise-create.component.html',
  styleUrl: './exercise-create.component.css'
})
export class ExerciseCreateComponent implements OnInit {
  exerciseForm!: FormGroup;
  muscles = Object.values(Muscle);

  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.exerciseForm = this.fb.group({
      name: ['', Validators.required],
      muscleInvolved: ['', Validators.required],
      description: ['', Validators.required],
      url: ['']
    });
  }

  save(): void {
    if (this.exerciseForm.valid) {
      const newExercise = this.exerciseForm.value;
      this.exerciseService.addExercise(newExercise).subscribe({
        next: () => {
          this.snackBar.open('Exercise added successfully!', 'Close', {duration: 3000});
          this.router.navigate(['/exercises']);
        },
        error: (message) => {
          this.snackBar.open(message.error[0].description, 'Close', {duration: 3000});
        }
      });
    } else {
      this.markAllAsTouched();
    }
  }

  markAllAsTouched(): void {
    this.exerciseForm.markAllAsTouched();
  }
}
