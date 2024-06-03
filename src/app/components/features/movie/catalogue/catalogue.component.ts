import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Genre, Movie } from '../../../../types/movie.type';
import { EMPTY, Subscription, catchError, forkJoin, map, tap } from 'rxjs';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { EndpointsKeys, MovieService } from '../../../../services/movie.service';
import { QueryParamsService } from '../../../../services/query-params.service';
import { FetchMovie } from '../../../../types/fetch-movie.type';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css'
})
export class CatalogueComponent implements OnInit, OnDestroy {
  @ViewChild('sortByForm') sortByForm: NgForm | undefined;
  @ViewChild('mobileFilters') mobileFilters: ElementRef | undefined;

  isMobileFiltersShown: boolean = false;

  isLoading = signal(true);

  movies: Movie[] = [];
  genres: Genre[] = [];

  releaseYearRange = {
    minYear: 1940,
    maxYear: 2024
  }

  type!: string;
  endpoint!: EndpointsKeys;

  sortByOptions = ['Popularity', 'Newest', 'Most rated'];
  defaultValue = this.sortByOptions[0];

  subscription$: Subscription | undefined;
  queryParamSub$: Subscription | undefined;

  currentPage!: number;
  pages!: number;
  validPage = signal(true);
  showPagination!: boolean;

  releaseTypeFiltersMovie = [
    {
      name: 'Coming soon',
      selected: false,
      url: '/browse/movies/upcoming'
    },
    {
      name: 'In theaters',
      selected: false,
      url: '/browse/movies/now-playing'
    }
  ];

  releaseTypeFiltersTvShow = [
    {
      name: 'On the air',
      selected: false,
      url: '/browse/tv/on-the-air'
    },
    {
      name: 'Airing today',
      selected: false,
      url: '/browse/tv/airing-today'
    }
  ]

  releaseTypeFilters!: {
    name: string,
    selected: boolean,
    id?: string,
    url?: string
  }[];

  constructor(
    public route: ActivatedRoute,
    private movieService: MovieService,
    private queryService: QueryParamsService,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.unsubscribe();

      const type = params.get('type');
      const endpoint = params.get('endpoint');

      if (type !== null) {
        this.type = type === 'movies' ? 'movie' : type;
      }

      if (endpoint !== null) {
        this.endpoint = endpoint as EndpointsKeys;
      }

      this.releaseTypeFilters = this.type === 'movie' ? this.releaseTypeFiltersMovie : this.releaseTypeFiltersTvShow;

      this.releaseTypeFilters.forEach(type => type.selected = false)
      this.queryParamSub$ = this.route.queryParams.subscribe(queries => {
        this.isLoading.set(true);

        const genreQueries: string[] = queries['genre'] !== undefined ? queries['genre'].split('+') : [];

        this.currentPage = Number(queries['page']) || 1;

        this.releaseTypeFilters.forEach(type => {
          if (type.url !== undefined) {
            type.selected = type.url.endsWith(this.endpoint);
          }
        })

        const movieSubscription = this.movieService.filter(this.endpoint, this.type, queries, this.currentPage)
          .pipe(
            catchError(err => {
              this.pages = 500;
              this.validPage.set(false);
              this.isLoading.set(false);
              return EMPTY;
              ;
            })
          )
        const genreSubscription = this.movieService.getGenres(this.type)
          .pipe(
            map(genres => genres.genres.map(genre => {
              const state = genreQueries.some(query => query === String(genre.id))
              return {
                ...genre,
                selected: state
              }
            }))
          )

        const sources = [movieSubscription, genreSubscription];

        this.subscription$ = forkJoin(sources)
          .subscribe(([result, genres]) => {
            this.genres = genres as Genre[];
            this.sortOptionsBySelected()

            if ('results' in result) {
              const movies = result;
              this.pages = movies.total_pages > 500 ? 500 : movies.total_pages;
              this.currentPage > this.pages ? this.validPage.set(false) : this.validPage.set(true);
              this.attachMovieGenreNamesBasedById(movies);
              this.movies = movies.results;
              this.showPagination = movies.total_pages > 0;
            }
            this.isLoading.set(false);
          })
      })
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  unsubscribe() {
    this.queryParamSub$?.unsubscribe();
    this.subscription$?.unsubscribe();
  }

  onSortBy() {
    const sortParam = this.sortByForm?.value['sortBy'].toLowerCase();
    const query = 'sortBy';

    this.queryService.updateQuery({
      [query]: sortParam
    })
  }

  sortOptionsBySelected() {
    this.genres = this.genres.sort((a, b) => {
      return (b.selected as any) - (a.selected as any);
    })
  }

  attachMovieGenreNamesBasedById(result: FetchMovie) {
    result.results.forEach(movie => {
      movie.genresNames = this.genres.map(genre => {
        if (movie.genre_ids.includes(genre.id)) {
          return {
            name: genre.name,
            id: genre.id
          }
        }
        return {
          name: '',
          id: ''
        };
      }).filter(genre => genre.name !== '')
    })
  }

  mobileFiltersToggle() {
    this.isMobileFiltersShown
      ? this.renderer.removeStyle(this.mobileFilters?.nativeElement, 'display')
      : this.renderer.setStyle(this.mobileFilters?.nativeElement, 'display', 'block');

    this.isMobileFiltersShown = !this.isMobileFiltersShown;
  }
}