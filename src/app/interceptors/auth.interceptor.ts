import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, Provider } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/dev-environments";

@Injectable()
class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if (req.url.startsWith('https://api.themoviedb.org/3')) {

            const request = req.clone({
                setHeaders: {
                    'Authorization': environment.movieDbAuthorization,
                    'accept': 'application/json'
                }
            })
            return next.handle(request);
        }

        return next.handle(req)
    }
}

export const authInterceptor: Provider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
}