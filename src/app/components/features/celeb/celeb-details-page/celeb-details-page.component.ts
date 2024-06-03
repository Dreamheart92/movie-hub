import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CastCredits, Celeb, TvCredits } from '../../../../types/celebs.type';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-celeb-details-page',
  templateUrl: './celeb-details-page.component.html',
  styleUrl: './celeb-details-page.component.css'
})
export class CelebDetailsPageComponent implements OnInit, OnDestroy {
  celeb!: Celeb;
  biographyChunks!: string[];
  biography!: string[];
  isFullBiographyShown!: boolean;
  movieCredits!: CastCredits[];
  tvCredits!: CastCredits[];

  sortByYearDesc: boolean = true;

  subscription!: Subscription;

  constructor(private route: ActivatedRoute) { }

  get knownFor() {
    return this.sortByVoteCount();
  }

  ngOnInit(): void {
    this.subscription = this.route.data.subscribe(({ details }) => {
      this.celeb = details;
      this.biographyChunks = this.celeb.biography.split('\n').filter(chunk => chunk !== '');
      this.biography = this.biographyChunks.slice(0, 2);
      this.isFullBiographyShown = this.biography.length === this.biographyChunks.length;
      this.movieCredits = details.movie_credits.cast;
      this.tvCredits = details.tv_credits.cast.map((credits: TvCredits) => {
        return {
          "id": credits.id,
          "release_date": credits.first_air_date,
          "title": credits.name,
          "vote_average": credits.vote_average,
          "character": credits.character
        }
      })
    })
  }

  sortByVoteCount() {
    return this.celeb.movie_credits.cast.sort((a, b) => {
      return Number(b.vote_count) - Number(a.vote_count);
    })
  }

  readMore() {
    this.biography = this.biographyChunks;
    this.isFullBiographyShown = true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
