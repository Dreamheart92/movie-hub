import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { EMPTY, Observable } from "rxjs";
import { UserService } from "../services/user.service";
import { User } from "../types/user.type";

export const profileResolver: ResolveFn<Observable<User> | null> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(UserService).getUserData();
    }