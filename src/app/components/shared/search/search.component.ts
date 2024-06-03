import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MovieService } from '../../../services/movie.service';
import { FetchMovie } from '../../../types/fetch-movie.type';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  @ViewChild('searchForm') searchForm: NgForm | undefined;
  @ViewChild('searchResults') searchResults: ElementRef | undefined;
  @ViewChild('searchBar') searchBar: ElementRef | undefined;

  searchedMovies!: FetchMovie;
  searchedTvShows!: FetchMovie;

  searching: boolean = false;

  subscription$: Subscription | undefined;

  constructor(private movieService: MovieService, private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.searching = false;
        this.subscription$?.unsubscribe();
        this.searchForm?.reset();
      }
    })
  }

  @HostListener('document:click', ['$event'])
  onCloseSearch(event: MouseEvent) {

    if (this.searching && this.searchResults) {
      const isClickInside =
        this.searchResults.nativeElement.contains(event.target)
        || this.searchBar?.nativeElement.contains(event.target);

      if (!isClickInside) {
        this.searching = false;
      }
    }
  }

  onSearch() {
    const searchQuery = this.searchForm?.value['search'];

    if (searchQuery.length >= 2) {
      this.subscription$ = this.movieService.search(searchQuery)
        .subscribe(result => {
          this.searchedMovies = result[0] as FetchMovie;
          this.searchedTvShows = result[1] as FetchMovie;
          this.searching = true;
        })
    }
  }

  closeSearchButton() {
    this.searching = false;
    this.searchForm?.reset();
  }
}
