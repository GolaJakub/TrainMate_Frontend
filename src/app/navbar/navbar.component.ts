import {Component, OnInit} from '@angular/core';
import {UserData} from "../users/user-data.model";
import {UsersService} from "../users/users.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {UserStateService} from "../users/user-state.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'tm-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  currentUser: UserData | null = null;

  constructor(private usersService: UsersService, private userStateService: UserStateService, private snackBar: MatSnackBar) {

  }

  logout() {
    this.usersService.logout();
  }

  ngOnInit(): void {
    this.currentUser = this.userStateService.getCurrentUser();
    this.userStateService.currentUser$.subscribe(
      userData => {
        this.currentUser = userData;
      },
      error => this.snackBar.open(error.error[0].description, 'Close', {duration: 3000})
    );
  }

}
