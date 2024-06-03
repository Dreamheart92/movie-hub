import { Component, OnDestroy, OnInit } from "@angular/core";
import { Movie } from "../../../types/movie.type";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrl: 'home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  carouselMovies: Movie[] = [];
  movies!: Movie[];
  airingTodayTvShows!: Movie[];
  trendingTvShowsThisWeek!: Movie[];
  moviesNowPlaying!: Movie[];
  isLoading: boolean = true;

  subscription!: Subscription;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subscription = this.route.data.subscribe(({ data }) => {
      this.carouselMovies = data.carouselMovies.results;
      this.airingTodayTvShows = data['airingTodayTvShows'].results;
      this.movies = data['movies'].results;
      this.trendingTvShowsThisWeek = data['trendingTvShowsThisWeek'].results;
      this.moviesNowPlaying = data['moviesNowPlaying'].results;

      this.isLoading = false;
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}