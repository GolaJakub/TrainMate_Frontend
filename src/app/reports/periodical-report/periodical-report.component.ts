import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import {PeriodicalReportService} from "./periodical-report.service";
import {PeriodicalReportCreateDto} from "./reports.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'tm-periodical-report',
  templateUrl: './periodical-report.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    RouterLink
  ],
  styleUrls: ['./periodical-report.component.css']
})
export class PeriodicalReportComponent implements OnInit {
  periodicalReportForm: FormGroup;

  fields = [
    { name: 'leftBiceps', label: 'Left Biceps' },
    { name: 'rightBiceps', label: 'Right Biceps' },
    { name: 'leftForearm', label: 'Left Forearm' },
    { name: 'rightForearm', label: 'Right Forearm' },
    { name: 'leftThigh', label: 'Left Thigh' },
    { name: 'rightThigh', label: 'Right Thigh' },
    { name: 'leftCalf', label: 'Left Calf' },
    { name: 'rightCalf', label: 'Right Calf' },
    { name: 'shoulders', label: 'Shoulders' },
    { name: 'chest', label: 'Chest' },
    { name: 'waist', label: 'Waist' },
    { name: 'abdomen', label: 'Abdomen' },
    { name: 'hips', label: 'Hips' },
    { name: 'weight', label: 'Weight' },
    { name: 'bodyFat', label: 'Body Fat' }
  ];

  constructor(private fb: FormBuilder, private router: Router, private periodicalReportService: PeriodicalReportService, private snackBar: MatSnackBar) {
    this.periodicalReportForm = this.fb.group({
      leftBiceps: ['', Validators.required],
      rightBiceps: ['', Validators.required],
      leftForearm: ['', Validators.required],
      rightForearm: ['', Validators.required],
      leftThigh: ['', Validators.required],
      rightThigh: ['', Validators.required],
      leftCalf: ['', Validators.required],
      rightCalf: ['', Validators.required],
      shoulders: ['', Validators.required],
      chest: ['', Validators.required],
      waist: ['', Validators.required],
      abdomen: ['', Validators.required],
      hips: ['', Validators.required],
      weight: ['', Validators.required],
      bodyFat: ['', Validators.required],
      images: this.fb.array([]) // Add a FormArray for images
    });

    this.addImageField(); // Add the initial image field
  }

  ngOnInit(): void {}

  isInvalid(controlName: string): boolean | undefined {
    const control = this.periodicalReportForm.get(controlName);
    return control?.invalid && control?.touched;
  }

  get imageControls() {
    return (this.periodicalReportForm.get('images') as FormArray).controls;
  }

  addImageField(): void {
    const imageArray = this.periodicalReportForm.get('images') as FormArray;
    if (imageArray.length < 4) {
      imageArray.push(this.fb.group({
        name: ['', Validators.required],
        type: ['', Validators.required],
        size: [0, Validators.required],
        content: ['', Validators.required]
      }));
    }
  }

  removeImageField(index: number): void {
    const imageArray = this.periodicalReportForm.get('images') as FormArray;
    imageArray.removeAt(index);
    if (imageArray.length === 0 || (imageArray.length < 4 && !this.hasEmptyImageField())) {
      this.addImageField();
    }
  }

  handleFileInput(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        this.setImageData(index, file, base64String);
        this.addImageFieldIfNeeded();
      };
    }
  }

  setImageData(index: number, file: File, base64String: string): void {
    const imageControl = (this.periodicalReportForm.get('images') as FormArray).at(index);
    imageControl.patchValue({
      name: file.name,
      type: file.type,
      size: file.size,
      content: base64String
    });
  }

  addImageFieldIfNeeded(): void {
    const imageArray = this.periodicalReportForm.get('images') as FormArray;
    const lastImageControl = imageArray.at(imageArray.length - 1);
    if (imageArray.length < 4 && lastImageControl && lastImageControl.value.name) {
      this.addImageField();
    }
  }

  hasEmptyImageField(): boolean {
    const imageArray = this.periodicalReportForm.get('images') as FormArray;
    return imageArray.controls.some(control => !control.value.name);
  }

  onSubmit(): void {
    if (this.periodicalReportForm.valid) {
      const formattedData = this.formatFormData(this.periodicalReportForm.value);
      this.periodicalReportService.submitPeriodicalReport(formattedData).subscribe({
        next: () => {
          this.snackBar.open('Periodical report saved successfully!', 'OK', { duration: 3000 });
          this.router.navigate(['']);
        },
        error: (message) => {
          this.snackBar.open(message.error[0].description, 'Close', { duration: 3000 });
        }
      });
    } else {
      this.periodicalReportForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    // Implement cancel functionality
    this.router.navigate(['/periodical-reports']);
  }

  onDelete(): void {
    // Implement delete functionality
    console.log('Report deleted');
  }

  formatFormData(formData: any): PeriodicalReportCreateDto {
    return {
      workoutPlanId: formData.workoutPlanId, // Ensure there's a form control for this if needed
      weight: formData.weight,
      bodyFat: formData.bodyFat,
      leftBiceps: formData.leftBiceps,
      rightBiceps: formData.rightBiceps,
      leftForearm: formData.leftForearm,
      rightForearm: formData.rightForearm,
      leftThigh: formData.leftThigh,
      rightThigh: formData.rightThigh,
      leftCalf: formData.leftCalf,
      rightCalf: formData.rightCalf,
      shoulders: formData.shoulders,
      chest: formData.chest,
      waist: formData.waist,
      abdomen: formData.abdomen,
      hips: formData.hips,
      images: formData.images?.map((image: any) => ({
        storageId: image.storageId?.value ? { value: image.storageId.value } : undefined,
        content: image.content,
        name: image.name,
        type: image.type,
        size: image.size
      }))
    };
  }

}
