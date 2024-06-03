import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { MovieService } from "../services/movie.service";
import { FetchMovie } from "../types/fetch-movie.type";
import { Observable, combineLatest } from "rxjs";

export const moviesResolver: ResolveFn<Observable<{ movies: FetchMovie, airingTodayTvShows: FetchMovie }>> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const movieService = inject(MovieService);

    const carouselMovies = movieService.getTrendingTodayMovies();
    const movies = movieService.filter('popular', 'movie');
    const moviesNowPlaying = movieService.filter('now-playing', 'movie');
    const airingTodayTvShows = movieService.getAiringTodayTvShows();
    const trendingTvShowsThisWeek = movieService.getTrendingTvShowsThisWeek();

    return combineLatest({
      carouselMovies,
      movies,
      airingTodayTvShows,
      trendingTvShowsThisWeek,
      moviesNowPlaying
    })
  };
