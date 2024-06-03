import { ActivatedRouteSnapshot, RouterStateSnapshot, ResolveFn } from "@angular/router";
import { Observable, combineLatest, map, of, tap } from "rxjs";
import { Image } from "../types/image.type";
import { MovieService } from "../services/movie.service";
import { inject } from "@angular/core";
import { Movie } from "../types/movie.type";
import { UserService } from "../services/user.service";

export const movieResolver: ResolveFn<Observable<{ images: Image[], movie: Movie, userActions?: { isLikedTheMovie: boolean, isAddedMovieToTheWatchlist: boolean } }>> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const movieService = inject(MovieService);
        const userService = inject(UserService);

        const movieId = route.params['id'];
        const images = movieService.getMovieImages(movieId);
        const movie = movieService.getMovieById(movieId);

        const userActions = userService.getUserData();

        if (userActions !== null) {
            const userActionsData = userActions
                .pipe(
                    map(user => {
                        return {
                            isLikedTheMovie: user.hasOwnProperty('likedMovies')
                                ? user.likedMovies.some(movie => movie === Number(movieId))
                                : false,
                            isAddedMovieToTheWatchlist: user.hasOwnProperty('watchlist')
                                ? user.watchlist.some(movie => movie.id === Number(movieId))
                                : false
                        }
                    })
                )
            return combineLatest({
                images,
                movie,
                userActions: userActionsData
            })
        }

        return combineLatest({
            images,
            movie
        })
    }