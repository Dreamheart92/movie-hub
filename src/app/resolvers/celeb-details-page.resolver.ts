import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Celeb } from "../types/celebs.type";
import { inject } from "@angular/core";
import { MovieService } from "../services/movie.service";

export const celebDetailsPageResolver: ResolveFn<Observable<Celeb>> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const celebId = route.params['id'];
        return inject(MovieService).getCelebById(celebId);
    }