import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Movie } from '../../../../../types/movie.type';
import { Cast } from '../../../../../types/credits.type';
import { keywords } from '../../../../../types/keywords.type';
import { MovieUtilityService } from '../../services/movie-utility.service';
import { AuthService } from '../../../../../services/auth.service';
import { MovieService } from '../../../../../services/movie.service';

type dataInput = {
  "type": string,
  "trailerKey": string,
  "movie": Movie,
  "runtime": string,
  "cast": Cast[],
  "director": string | undefined,
  "keywords": keywords[];
  "releaseDate": string,
  "title": string,
  "isLikedTheMovie": boolean,
  "isAddedMovieToTheWatchlist": boolean,
  "episodes"?: number,
  "seasons"?: number,
}

@Component({
  selector: 'app-base-details-page',
  templateUrl: './base-details-page.component.html',
  styleUrl: './base-details-page.component.css'
})
export class DetailsPageComponent implements OnInit {
  @ViewChild('btnLikeMovie', { static: true }) btnLikeMovie: ElementRef | undefined;
  @ViewChild('btnWatchlist', { static: true }) btnWatchList: ElementRef | undefined;

  @Input() data !: dataInput;

  movieId!: number;
  isLoggedIn!: boolean;
  routerLink!: string | null;

  isPopoverShown: boolean = false;
  popoverMessage!: string;

  timerId!: ReturnType<typeof setTimeout>;

  constructor(
    public readonly movieUtility: MovieUtilityService,
    private authService: AuthService,
    private movieService: MovieService,
    private render: Renderer2
  ) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.movieId = this.data.movie.id;
    this.routerLink = this.isLoggedIn ? null : '/login';
  }

  handleWatchlistAction() {
    const isAddedMovieToTheWatchlist = this.data.isAddedMovieToTheWatchlist;
    const uid = this.authService.user()?.uid;

    if (uid !== undefined) {
      if (!isAddedMovieToTheWatchlist) {

        this.movieService.addMovieToWatchlist(uid, this.data.movie);
        this.data.isAddedMovieToTheWatchlist = true;

        this.popoverMessage = this.data.title + ' is added to your watchlist'
        this.showPopover();

      } else if (isAddedMovieToTheWatchlist) {

        this.movieService.removeFromWatchlist(uid, this.movieId)
          .subscribe();

        this.data.isAddedMovieToTheWatchlist = false;

        this.popoverMessage = this.data.title + ' is removed from your watchlist'
        this.showPopover();
      }
    }
  }

  handleLikeAction() {
    const isLikedMovie = this.data.isLikedTheMovie;
    const uid = this.authService.user()?.uid;

    if (uid !== undefined) {
      if (!isLikedMovie) {
        this.movieService.likeMovie(uid, this.movieId);
        this.data.isLikedTheMovie = true;

        this.popoverMessage = 'Liked ' + this.data.title;
        this.showPopover();
      } else if (isLikedMovie) {
        this.movieService.unlikeMovie(uid, this.movieId);
        this.data.isLikedTheMovie = false;

        this.popoverMessage = 'Unliked ' + this.data.title;
        this.showPopover();
      }
    }
  }

  showSignInText(event: MouseEvent) {
    const target = (event.target as HTMLElement).classList[1];
    const element = target.includes('like') ? this.btnLikeMovie?.nativeElement : this.btnWatchList?.nativeElement;

    this.render.setProperty(element, 'textContent', 'Sign in');
  }

  restoreTextContent(event: MouseEvent) {
    const target = (event.target as HTMLElement).classList[1];
    const element = target.includes('like') ? this.btnLikeMovie?.nativeElement : this.btnWatchList?.nativeElement;

    const textContent = target.includes('like') ? 'Like' : 'Watchlist';

    this.render.setProperty(element, 'textContent', textContent);
  }

  showPopover() {
    clearTimeout(this.timerId);

    this.isPopoverShown = true;

    this.timerId = setTimeout(() => {
      this.isPopoverShown = false;
    }, 2000);
  }
}