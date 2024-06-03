import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../../types/movie.type';
import { AuthService } from '../../../services/auth.service';
import { MovieService } from '../../../services/movie.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {

  username!: string;
  watchlist!: number[];
  movies!: Movie[];

  subscription!: Subscription;


  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private movieService: MovieService
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.data.subscribe(({ user }) => {
      this.username = user.username;
      this.movies = user.watchlist;

    })
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/']);
  }

  removeFromWatchlish(movieId: number) {
    const uid = this.authService.user()?.uid;

    if (uid !== undefined) {
      this.movieService.removeFromWatchlist(uid, movieId)
        .subscribe(result => {
          if (result !== null) {
            this.movies = result;
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
