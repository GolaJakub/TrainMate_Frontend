import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { PeriodicalReportService } from "./periodical-report.service";
import { PeriodicalReportCreateDto, PeriodicalReportUpdateDto, PeriodicalReportProjection, FileStorageDto } from "./reports.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserStateService } from "../../users/user-state.service";

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
  workoutPlanId: string | null = null;
  reportId: number | null = null;
  version: number | null = null;
  isEditMode: boolean = false;

  fields = [
    {name: 'leftBiceps', label: 'Left Biceps'},
    {name: 'rightBiceps', label: 'Right Biceps'},
    {name: 'leftForearm', label: 'Left Forearm'},
    {name: 'rightForearm', label: 'Right Forearm'},
    {name: 'leftThigh', label: 'Left Thigh'},
    {name: 'rightThigh', label: 'Right Thigh'},
    {name: 'leftCalf', label: 'Left Calf'},
    {name: 'rightCalf', label: 'Right Calf'},
    {name: 'shoulders', label: 'Shoulders'},
    {name: 'chest', label: 'Chest'},
    {name: 'waist', label: 'Waist'},
    {name: 'abdomen', label: 'Abdomen'},
    {name: 'hips', label: 'Hips'},
    {name: 'weight', label: 'Weight'},
    {name: 'bodyFat', label: 'Body Fat'}
  ];

  constructor(private fb: FormBuilder, private router: Router, private periodicalReportService: PeriodicalReportService, private snackBar: MatSnackBar, private userStateService: UserStateService, private route: ActivatedRoute) {
    this.periodicalReportForm = this.fb.group({
      leftBiceps: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      rightBiceps: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      leftForearm: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      rightForearm: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      leftThigh: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      rightThigh: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      leftCalf: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      rightCalf: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      shoulders: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      chest: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      waist: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      abdomen: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      hips: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      weight: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      bodyFat: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      images: this.fb.array([]) // Add a FormArray for images
    });

    this.addImageField(); // Add the initial image field
  }

  ngOnInit(): void {
    this.workoutPlanId = this.route.snapshot.paramMap.get('workoutPlanId');
    this.reportId = Number(this.route.snapshot.paramMap.get('reportId'));

    if (this.reportId) {
      this.isEditMode = true;
      this.loadReportData(this.reportId);
    }
  }

  loadReportData(reportId: number): void {
    this.periodicalReportService.getReportFiles(reportId).subscribe(
      files => {
        this.periodicalReportService.getPeriodicalReport(reportId).subscribe(
          report => {
            this.periodicalReportForm.patchValue(report);
            this.version = report.version;
            this.setImageControls(files);
          },
          error => {
            this.snackBar.open('Error fetching report data', 'Close', { duration: 3000 });
          }
        );
      },
      error => {
        this.snackBar.open('Error fetching report files', 'Close', { duration: 3000 });
      }
    );
  }

  setImageControls(files: FileStorageDto[]): void {
    const imageArray = this.periodicalReportForm.get('images') as FormArray;
    imageArray.clear();
    files.forEach(file => {
      const fileGroup = this.fb.group({
        name: [file.name],
        type: [file.type],
        size: [file.size],
        content: [file.content]
      });
      imageArray.push(fileGroup);
    });
    if (imageArray.length < 4) {
      this.addImageField();
    }
  }

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
        name: [''],
        type: [''],
        size: [0],
        content: ['']
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
      if (this.isEditMode) {
        const updateData: PeriodicalReportUpdateDto = {
          ...formattedData,
          reportId: this.reportId!,
          version: this.version!
        };
        this.periodicalReportService.updatePeriodicalReport(this.reportId!, updateData).subscribe({
          next: () => {
            this.snackBar.open('Periodical report updated successfully!', 'OK', { duration: 3000 });
            window.history.back();
            this.userStateService.loadCurrentUser();
          },
          error: (message) => {
            this.snackBar.open(message.error[0].description, 'Close', { duration: 3000 });
          }
        });
      } else {
        if (this.workoutPlanId) {
          this.periodicalReportService.submitPeriodicalReport(formattedData).subscribe({
            next: () => {
              this.snackBar.open('Periodical report saved successfully!', 'OK', { duration: 3000 });
              window.history.back();
              this.userStateService.loadCurrentUser();
            },
            error: (message) => {
              this.snackBar.open(message.error[0].description, 'Close', { duration: 3000 });
            }
          });
        } else {
          this.periodicalReportService.submitInitialPeriodicalReport(formattedData).subscribe({
            next: () => {
              this.snackBar.open('Initial report saved successfully!', 'OK', { duration: 3000 });
              window.history.back();
              this.userStateService.loadCurrentUser();
            },
            error: (message) => {
              this.snackBar.open(message.error[0].description, 'Close', { duration: 3000 });
            }
          });
        }



      }
    } else {
      this.periodicalReportForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    window.history.back();
  }

  isMenteeFirstLogin(): boolean | undefined {
    return this.userStateService.isFirstLogin();
  }

  formatFormData(formData: any): PeriodicalReportCreateDto {
    return {
      workoutPlanId: Number(this.workoutPlanId),
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
      images: formData.images?.filter((image: any) => image.name) // Filter out empty image fields
        .map((image: any) => ({
          storageId: image.storageId?.value ? { value: image.storageId.value } : undefined,
          content: image.content,
          name: image.name,
          type: image.type,
          size: image.size
        }))
    };
  }
}
