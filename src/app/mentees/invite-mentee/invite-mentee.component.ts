import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from "@angular/common";
import {InviteMenteeService} from "./invite-mentee.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'tm-invite-mentee',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './invite-mentee.component.html',
  styleUrls: ['./invite-mentee.component.css']
})
export class InviteMenteeComponent {
  inviteForm: FormGroup;

  constructor(private fb: FormBuilder, private inviteMenteeService: InviteMenteeService, private snackBar: MatSnackBar, private router: Router) {
    this.inviteForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onInvite() {
    if (this.inviteForm.valid) {
      const email = this.inviteForm.value.email;
      this.inviteMenteeService.invite(email).subscribe({
        next: () => {
          this.snackBar.open('Mentee invited successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/mentees']);
        },
        error: (message) => {
          this.snackBar.open(message.error[0].description, 'Close', { duration: 3000 });
        }
      });
    }
  }
}
