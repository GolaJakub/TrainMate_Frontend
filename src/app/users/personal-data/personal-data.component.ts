import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {UserStateService} from "../user-state.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UsersService} from "../users.service";

@Component({
  selector: 'tm-personal-data',
  templateUrl: './personal-data.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    RouterLink,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault
  ],
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent implements OnInit {
  menteeDetailsForm: FormGroup;

  fields = [
    {name: 'email', label: 'Email'},
    {name: 'firstname', label: 'First Name'},
    {name: 'lastname', label: 'Last Name'},
    {name: 'phone', label: 'Phone Number'},
    {name: 'dateOfBirth', label: 'Date of Birth'},
    {name: 'gender', label: 'Gender'},
    {name: 'height', label: 'Height'},
  ];

  constructor(private fb: FormBuilder, private router: Router, private userStateService: UserStateService, private snackBar: MatSnackBar, private userService: UsersService) {
    this.menteeDetailsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', [Validators.required, Validators.pattern('^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$')]],
      lastname: ['', [Validators.required, Validators.pattern('^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      height: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  ngOnInit(): void {
    const currentUser = this.userStateService.getCurrentUser();
    if (currentUser) {
      this.menteeDetailsForm.patchValue({
        email: currentUser.personalInfo.email,
        firstname: currentUser.personalInfo.firstname,
        lastname: currentUser.personalInfo.lastname,
        phone: currentUser.personalInfo.phone,
        dateOfBirth: currentUser.personalInfo.dateOfBirth,
        gender: currentUser.personalInfo.gender,
        height: currentUser.personalInfo.height,
      });
    }

    if (currentUser?.firstLogin && currentUser?.role === "MENTEE") {
      this.snackBar.open('It\'s your first login, you need to complete your personal info and initial report to continue.', 'OK', {duration: 10000});
    }
  }

  isMenteeFirstLogin(): boolean {
    return !!(this.userStateService.getCurrentUser()?.firstLogin && this.userStateService.getCurrentUser()?.role === "MENTEE");
  }

  isInvalid(controlName: string): boolean | undefined {
    const control = this.menteeDetailsForm.get(controlName);
    return control?.invalid && control?.touched;
  }

  save(): void {
    if (this.menteeDetailsForm.valid) {
      const updatedMentee = {...this.menteeDetailsForm.value};

      this.userService.saveMentee(updatedMentee).subscribe({
        next: () => {
          this.snackBar.open('Personal data saved successfully!', 'OK', {duration: 3000});
          if (this.isMenteeFirstLogin()) {
            this.router.navigate(['/periodical-report']);
          }
          this.userStateService.loadCurrentUser();
        },
        error: (message) => {
          this.snackBar.open(message.error[0].description, 'Close', {duration: 3000});
        }
      });
    } else {
      this.menteeDetailsForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    window.history.back();
  }

}
