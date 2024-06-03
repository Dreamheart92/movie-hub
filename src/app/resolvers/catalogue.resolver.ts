import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { BehaviorSubject, Observable, combineLatest, filter, map } from "rxjs";
import { inject } from "@angular/core";
import { MovieService } from "../services/movie.service";

export const catalogueResolver: ResolveFn<Observable<any>> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        let queries: string[] = [];
        const genres = inject(MovieService).getMovieGenres()
            .pipe(
                map(genres => genres.genres.map(genre => {
                    const state = queries.some(query => query === String(genre.id));

                    return {
                        ...genre,
                        selected: state
                    }
                }))
            )

        const queryParams = route.queryParams;

        if (queryParams.hasOwnProperty('genre')) {
            queries = Object.values(queryParams)[0].split('+');
        }

        console.log(queries);
        

        const movies = inject(MovieService).search(queries);

        return combineLatest({
            movies,
            genres
        })
    }
