import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TV } from '../../../../../types/tv-series.type';
import { Cast } from '../../../../../types/credits.type';
import { keywords } from '../../../../../types/keywords.type';
import { MovieUtilityService } from '../../services/movie-utility.service';
import { AuthService } from '../../../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tv-show-details-page',
  templateUrl: './tv-show-details-page.component.html',
  styleUrl: './tv-show-details-page.component.css'
})
export class TvShowDetailsPageComponent implements OnInit, OnDestroy {
  createdBy!: string;
  tvShow!: TV;
  trailerKey: string = 'https://www.youtube.com/embed/';
  cast!: Cast[];
  keywords!: keywords[];
  releaseDate!: string;
  title!: string;
  runtime!: string;
  test!: string;
  isLikedTheMovie!: boolean;
  isAddedMovieToTheWatchlist!: boolean;

  subscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private movieUtilityService: MovieUtilityService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.data.subscribe(({ data }) => {
      const tvShow = data.tvShow;
      const tvShowVideos = data.tvShowVideos.results;

      if (this.authService.isLoggedIn()) {
        this.isLikedTheMovie = data.userActions.isLikedTheMovie;
        this.isAddedMovieToTheWatchlist = data.userActions.isAddedMovieToTheWatchlist;
      }

      this.tvShow = tvShow;
      this.createdBy = tvShow['created_by']?.[0]?.name || '-';
      this.trailerKey += this.movieUtilityService.getTrailer(tvShowVideos);
      this.cast = tvShow.credits.cast;
      this.keywords = tvShow.keywords.results;
      this.releaseDate = tvShow['first_air_date'];
      this.title = tvShow.name;
      this.runtime = this.movieUtilityService.convertRuntime(tvShow['last_episode_to_air'].runtime);
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}