import {Component} from '@angular/core';
import {NgForOf} from "@angular/common";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'tm-workouts',
  standalone: true,
  imports: [
    NgForOf,
    FontAwesomeModule
  ],
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.css'
})
export class WorkoutsComponent {
  days: string[] = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
  tasks: any = {
    'Poniedziałek': [
      {
        name: 'Wyciskanie leżąc',
        time: '2-3 min',
        intensity: 87,
        weight: 100
      }
    ],
    'Wtorek': [],
    'Środa': [],
    'Czwartek': [],
    'Piątek': [],
    'Sobota': [],
    'Niedziela': []
  };


}
