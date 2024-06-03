import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Observable, combineLatest, map } from "rxjs";
import { MovieService } from "../services/movie.service";
import { inject } from "@angular/core";
import { Movie } from "../types/movie.type";
import { UserService } from "../services/user.service";

export const tvShowResolver: ResolveFn<Observable<{ tvShow: Movie, tvShowVideos: Object, userActions?: { isLikedTheMovie: boolean, isAddedMovieToTheWatchlist: boolean } }>> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const movieService = inject(MovieService);
        const userService = inject(UserService);

        const tvShowId = route.params['id'];
        const tvShow = movieService.getTvById(tvShowId);
        const tvShowVideos = movieService.getTvShowVideos(tvShowId);

        const userActions = userService.getUserData();

        if (userActions !== null) {
            const userActionsData = userActions
                .pipe(
                    map(user => {
                        return {
                            isLikedTheMovie: user.hasOwnProperty('likedMovies')
                                ? user.likedMovies.some(movie => movie === Number(tvShowId))
                                : false,
                            isAddedMovieToTheWatchlist: user.hasOwnProperty('watchlist')
                                ? user.watchlist.some(movie => movie.id === Number(tvShowId))
                                : false
                        }
                    })
                )
            return combineLatest({
                tvShow,
                tvShowVideos,
                userActions: userActionsData
            })
        }

        return combineLatest({
            tvShow,
            tvShowVideos
        })
    }