import {Component, OnInit} from '@angular/core';
import {UsersService} from "./users.service";
import {UserData} from "./user-data.model";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  user?: UserData;

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.userService.getCurrentUserData$().subscribe(result => {
      this.user = result;
    })
  }

}
