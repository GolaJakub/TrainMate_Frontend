import {Component, OnInit} from '@angular/core';
import {MenteeProjection, MenteeSearchCriteria} from "./mentee.model";
import {MenteeService} from "../mentee.service";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {NgClass, NgForOf} from "@angular/common";
import {faCheckCircle, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'tm-mentees-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgForOf,
    FontAwesomeModule,
    NgClass
  ],
  templateUrl: './mentees-list.component.html',
  styleUrl: './mentees-list.component.css'
})
export class MenteesListComponent implements OnInit {
  mentees: MenteeProjection[] = [];
  searchCriteria: MenteeSearchCriteria = new MenteeSearchCriteria();
  currentPage = 0;
  totalPages = 0;
  pageSize = 5;

  constructor(private menteeService: MenteeService) { }

  ngOnInit(): void {
    this.onSearchButtonClick();
  }

  onSearchButtonClick(): void {
    this.searchCriteria.page = this.currentPage;
    this.searchCriteria.pageSize = this.pageSize;
    this.menteeService.searchMentees(this.searchCriteria).subscribe(response => {
      this.mentees = response.content;
      this.totalPages = response.totalPages;
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.onSearchButtonClick();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.onSearchButtonClick();
  }

  range(totalPages: number): number[] {
    return [...Array(totalPages).keys()];
  }

  protected readonly faCheckCircle = faCheckCircle;
  protected readonly faTimesCircle = faTimesCircle;
}
