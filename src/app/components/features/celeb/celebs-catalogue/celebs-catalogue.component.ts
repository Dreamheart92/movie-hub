import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Celebs } from '../../../../types/celebs.type';
import { MovieService } from '../../../../services/movie.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-celebs-catalogue',
  templateUrl: './celebs-catalogue.component.html',
  styleUrl: './celebs-catalogue.component.css'
})
export class CelebsCatalogueComponent implements OnInit, OnDestroy {

  celebs!: Celebs[];
  currentPage!: number;
  pages!: number;

  isLoading = signal(true);

  querySubscription!: Subscription;
  getCelebsSubscription!: Subscription;

  constructor(private route: ActivatedRoute, private movieService: MovieService) { }

  ngOnInit(): void {
    this.querySubscription = this.route.queryParams.subscribe(queries => {
      this.isLoading.set(true);
      const page = queries['page'] || 1;
      this.getCelebsSubscription = this.movieService.getCelebs(page)
        .subscribe(celebs => {
          this.celebs = celebs.results;
          this.currentPage = celebs.page;
          this.pages = celebs.total_pages > 500 ? 500 : celebs.total_pages;

          this.isLoading.set(false);
        })
    })
  }

  getKnownFor(celeb: Celebs) {
    const knownFor = celeb.known_for.map(movie => {
      return movie.media_type === 'tv' ? movie.name : movie.title;
    });

    return knownFor.join(', ');
  }

  ngOnDestroy(): void {
    this.querySubscription.unsubscribe();
    this.getCelebsSubscription.unsubscribe();
  }
}
