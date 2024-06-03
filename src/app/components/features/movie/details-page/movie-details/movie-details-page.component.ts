import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Image } from "../../../../../types/image.type";
import { Cast } from "../../../../../types/credits.type";
import { Movie } from "../../../../../types/movie.type";
import { keywords } from "../../../../../types/keywords.type";
import { MovieUtilityService } from "../../services/movie-utility.service";
import { AuthService } from "../../../../../services/auth.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-movie-details',
    templateUrl: 'movie-details-page.component.html',
    styleUrl: 'movie-details-page.component.css',
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
    movie!: Movie;
    images!: Image;
    director: string | undefined;
    trailerKey: string = 'https://www.youtube.com/embed/';
    runtime!: string;
    cast!: Cast[];
    keywords!: keywords[];
    releaseDate!: string;
    isLikedTheMovie!: boolean;
    isAddedMovieToTheWatchlist!: boolean;

    usDollarFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    })

    subscription!: Subscription;

    constructor(
        private route: ActivatedRoute,
        private movieUtilityService: MovieUtilityService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.subscription = this.route.data.subscribe(({ data }) => {
            if (this.authService.isLoggedIn()) {
                this.isLikedTheMovie = data.userActions.isLikedTheMovie;
                this.isAddedMovieToTheWatchlist = data.userActions.isAddedMovieToTheWatchlist;
            }

            this.movie = data.movie;
            this.director = this.movieUtilityService.findDirector(this.movie.credits.crew);
            this.runtime = this.movieUtilityService.convertRuntime(data.movie.runtime);
            this.trailerKey += this.movieUtilityService.getTrailer(data.movie.videos.results);
            this.cast = data.movie.credits.cast;
            this.images = data.images;
            this.keywords = data.movie.keywords.keywords;
            this.releaseDate = data.movie['release_date'];
        })
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}