import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {filter} from "rxjs";
import {CommonModule} from "@angular/common";
import {NavbarComponent} from "./navbar/navbar.component";
import {UserStateService} from "./users/user-state.service";
import {FaIconLibrary} from "@fortawesome/angular-fontawesome";
import {
  faClock,
  faHeartbeat,
  faDumbbell,
  faRedo,
  faStopwatch,
  faSync,
  faTrash,
  faEdit
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TrainMate';

  constructor(library: FaIconLibrary) {
    library.addIcons(faClock, faDumbbell, faHeartbeat, faRedo, faStopwatch, faSync, faTrash, faEdit);
  }
}
