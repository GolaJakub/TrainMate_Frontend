import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CommonModule} from "@angular/common";
import {NavbarComponent} from "./navbar/navbar.component";
import {FaIconLibrary} from "@fortawesome/angular-fontawesome";
import {
  faClock,
  faDumbbell,
  faEdit,
  faHeartbeat,
  faRedo,
  faStopwatch,
  faSync,
  faTrash
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
