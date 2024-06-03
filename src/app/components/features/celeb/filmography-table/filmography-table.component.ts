import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { CastCredits } from '../../../../types/celebs.type';

@Component({
  selector: 'app-filmography-table',
  templateUrl: './filmography-table.component.html',
  styleUrl: './filmography-table.component.css'
})
export class FilmographyTableComponent implements OnInit {
  @Input() credits!: CastCredits[];
  @Input() type!: string;

  sortByYearDesc: boolean = true;
  sortByRatingDesc: boolean = false;

  dropdownArrowRating = {
    desc: false,
    asc: false
  }

  dropdownArrowYear = {
    desc: false,
    asc: false
  }

  filterSelected = {
    sortByYear: false,
    sortByRating: false
  }

  ngOnInit(): void {
    this.sortByYear();
  }

  sortByYear() {
    this.switchOrder('year');
    this.credits = this.credits.slice(0, this.credits.length).sort((a, b) => {
      const aMinutes = this.converDateToMinutes(a);
      const bMinutes = this.converDateToMinutes(b);
      return this.sortByYearDesc ? aMinutes - bMinutes : bMinutes - aMinutes;
    })
    this.sortByYearDesc = !this.sortByYearDesc;
    this.switchFilter(true, false);
  }

  converDateToMinutes(date: { "release_date": string }) {
    const currentDate = moment();
    const minutes = currentDate.diff(moment(date.release_date), 'minutes');

    const safeNumber = this.sortByYearDesc ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;

    return isNaN(minutes) ? safeNumber : minutes;
  }

  sortByRating() {
    this.switchOrder('rating');
    this.credits = this.credits.slice(0, this.credits.length).sort((a, b) => {
      return this.sortByRatingDesc === true ? b.vote_average - a.vote_average : a.vote_average - b.vote_average;
    })
    this.sortByRatingDesc = !this.sortByRatingDesc;
    this.switchFilter(false, true);
  }

  switchFilter(year: boolean, rating: boolean) {
    this.filterSelected.sortByYear = year;
    this.filterSelected.sortByRating = rating;
  }

  switchOrder(filterType: string) {

    if (filterType === 'year') {
      this.dropdownArrowYear.desc = this.dropdownArrowYear.asc
      this.dropdownArrowYear.asc = !this.dropdownArrowYear.desc
    } else if (filterType === 'rating') {
      this.dropdownArrowRating.desc = this.dropdownArrowRating.asc
      this.dropdownArrowRating.asc = !this.dropdownArrowRating.desc
    }
  }
}
