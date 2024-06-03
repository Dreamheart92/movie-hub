import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/dev-environments";
import { FetchMovie } from "../types/fetch-movie.type";
import { Genres, Movie } from "../types/movie.type";
import { Image } from "../types/image.type";
import { Params } from "@angular/router";
import moment from "moment";
import { forkJoin, map, take } from "rxjs";
import { Celeb, Celebs } from "../types/celebs.type";
import { AngularFireDatabase } from "@angular/fire/compat/database";

export type EndpointsKeys = 'now-playing' | 'popular' | 'top-rated' | 'upcoming' | 'airing-today' | 'on-the-air' | 'all';
type Endpoint = {
  [key in EndpointsKeys]: string
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient, private db: AngularFireDatabase) {
  }

  // Move getCelebs to api module

  getCelebs(page: number = 1) {
    return this.http.get<{ page: number, results: Celebs[], 'total_pages': number }>(environment.apiUrl + `/person/popular?language=en-US&page=${page}`);
  }

  getCelebById(celebId: string) {
    return this.http.get<Celeb>(environment.apiUrl + `/person/${celebId}?append_to_response=movie_credits%2Ctv_credits%2Ccombined_credits&language=en-US`);
  }

  addMovieToWatchlist(uid: string, movie: Movie) {
    this.db.list('users', ref => ref.orderByChild('uid').equalTo(uid))
      .snapshotChanges()
      .pipe(
        take(1)
      )
      .subscribe(users => {
        if (users.length > 0) {
          const userKey = users[0].key;

          const payload = users[0].payload.val() as { email: string; uid: string; watchlist: Movie[] };
          const watchlist = payload.watchlist || [];

          const isAlreadyInTheWatchlist = watchlist.some(watchListMovie => watchListMovie.id === movie.id);

          if (!isAlreadyInTheWatchlist) {
            watchlist.push(movie);
            this.db.object(`users/${userKey}`).update({ watchlist });
          }
        }
      })
  }

  removeFromWatchlist(uid: string, movieId: number) {
    return this.db.list('users', ref => ref.orderByChild('uid').equalTo(uid)).snapshotChanges()
      .pipe(
        take(1),
        map(user => {
          if (user.length > 0) {
            const userKey = user[0].key;

            const payload = user[0].payload.val() as { email: string; uid: string; watchlist: Movie[] };
            const watchlist = payload.watchlist || [];

            const isInTheWatchlist = watchlist.find(watchlistMovie => watchlistMovie.id === Number(movieId));

            if (isInTheWatchlist) {
              const indexOfMovie = watchlist.indexOf(isInTheWatchlist);
              watchlist.splice(indexOfMovie, 1);

              this.db.object(`users/${userKey}`).update({ watchlist });
              return watchlist;
            }
          }
          return null;
        })
      )
  }

  likeMovie(uid: string, movieId: number) {
    this.db.list('users', ref => ref.orderByChild('uid').equalTo(uid)).snapshotChanges()
      .pipe(
        take(1)
      )
      .subscribe(users => {
        const userKey = users[0].key;
        const payload = users[0].payload.val() as { likedMovies: number[] };

        const likedMovies = payload.likedMovies || [];
        if (!likedMovies.includes(movieId)) {
          likedMovies.push(movieId);
          this.db.object(`users/${userKey}`).update({ likedMovies });
        }
      })
  }

  unlikeMovie(uid: string, movieId: number) {
    this.db.list('users', ref => ref.orderByChild('uid').equalTo(uid)).snapshotChanges()
      .pipe(
        take(1)
      ).subscribe(user => {
        const userKey = user[0].key;
        const payload = user[0].payload.val() as { likedMovies: number[] };

        const likedMovies = payload.likedMovies || [];

        if (likedMovies.includes(movieId)) {
          const indexOfMovie = likedMovies.indexOf(movieId);
          likedMovies.splice(indexOfMovie, 1);
          this.db.object(`users/${userKey}`).update({ likedMovies });
        }
      })
  }

  getTrendingTodayMovies() {
    return this.http.get<FetchMovie>(environment.apiUrl + '/trending/movie/day?language=en-US');
  }

  getMovieById(movieId: string) {
    return this.http.get<Movie>(environment.apiUrl + `/movie/${movieId}?append_to_response=videos%2Ccredits%2Ckeywords&language=en-US`);
  }

  getTvById(movieId: string) {
    return this.http.get<Movie>(environment.apiUrl + `/tv/${movieId}?append_to_response=credits%2Ckeywords&language=en-US`);
  }

  getMovieImages(movieId: string) {
    return this.http.get<Image[]>(environment.apiUrl + `/movie/${movieId}/images?include_image_language=en&language=en`);
  }

  getTvImages(movieId: string) {
    return this.http.get<Image[]>(environment.apiUrl + `/tv/${movieId}/images?include_image_language=en&language=en`);
  }

  getTvShowVideos(tvShowId: string) {
    return this.http.get(environment.apiUrl + `/tv/${tvShowId}/videos?language=en-US`);
  }

  getAiringTodayTvShows() {
    return this.http.get<FetchMovie>(environment.apiUrl + '/tv/airing_today?language=en-US&page=1')
  }

  getTrendingTvShowsThisWeek() {
    return this.http.get<FetchMovie>(environment.apiUrl + '/trending/tv/week?language=en-US');
  }

  getGenres(type: string) {
    return this.http.get<Genres>(environment.apiUrl + `/genre/${type}/list?language=en`);
  }

  filter(endpoint: EndpointsKeys, type: string, queries?: Params, page: number = 1) {

    const upcomingDates = {
      minDate: moment().add(1, 'days').format('YYYY-MM-DD'),
      maxDate: moment().add(7, 'days').format('YYYY-MM-DD')
    }

    const nowPlayingDates = {
      minDate: moment().subtract(15, 'days').format('YYYY-MM-DD'),
      maxDate: moment().format('YYYY-MM-DD')
    }

    const airingToday = moment().format('YYYY-MM-DD');
    const onTheAir = {
      minDate: moment().add(2, 'days').format('YYYY-MM-DD'),
      maxDate: moment().add(10, 'days').format('YYYY-MM-DD')
    }

    const movieEndpoints: Endpoint = {
      'now-playing': `/discover/movie?include_adult=false&sort_by=popularity.desc&include_video=false&language=en-US&page=${page}&with_release_type=2|3&release_date.gte=${nowPlayingDates.minDate}&release_date.lte=${nowPlayingDates.maxDate}`,
      'popular': `/discover/movie?include_adult=false&sort_by=popularity.desc&include_video=false&language=en-US&page=${page}`,
      'top-rated': `/discover/movie?include_adult=false&sort_by=vote_average.desc&include_video=false&language=en-US&page=${page}&without_genres=99,10755&vote_count.gte=200`,
      'upcoming': `/discover/movie?include_adult=false&sort_by=popularity.desc&include_video=false&language=en-US&page=${page}&with_release_type=2|3&release_date.gte=${upcomingDates.minDate}&release_date.lte=${upcomingDates.maxDate}`,
      'all': `/discover/movie?include_adult=false&sort_by=popularity.desc&include_video=false&language=en-US&page=${page}`,
      'airing-today': '',
      'on-the-air': '',
    }

    const tvEndpoints: Endpoint = {
      'airing-today': `/discover/tv?include_adult=false&sort_by=vote_count.desc&language=en-US&page=${page}&air_date.lte=${airingToday}&air_date.gte=${airingToday}`,
      'on-the-air': `/discover/tv?include_adult=false&sort_by=vote_average.desc&language=en-US&page=${page}&vote_count.gte=50&air_date.lte=${onTheAir.maxDate}&air_date.gte=${onTheAir.minDate}`,
      'popular': `/discover/tv?include_adult=false&sort_by=popularity.desc&language=en-US&page=${page}&vote_count.gte=100`,
      'top-rated': `/discover/tv?include_adult=false&sort_by=vote_average.desc&language=en-US&page=${page}&vote_count.gte=200`,
      'all': `/discover/tv?include_adult=false&sort_by=popularity.desc&language=en-US&page=${page}`,
      'now-playing': '',
      'upcoming': '',
    }

    let url: string | string[] = type === 'movie' ? movieEndpoints[endpoint] : tvEndpoints[endpoint];

    if (queries && Object.keys(queries).length) {

      const queriesEntries = Object.entries(queries);
      queriesEntries.forEach(([query, param]) => {
        if (query === 'genre') {
          url += `&with_genres=${param.split('+').join('%2C')}`
        } else if (query === 'sortBy') {
          const sortBy = sortByQuery({ [query]: param });
          if (typeof url === 'string') {
            url = url.split('&');
            url[1] = sortBy;
            url = url.join('&');
          }
        } else if (query === 'tag') {
          url += `&with_keywords=${param.split('+').join('%2C')}`
        }
      })

      const searchByYear = searchByYearQuery(queries, type, endpoint);

      if (searchByYear !== false) {
        url += searchByYear
      }
    }

    return this.http.get<FetchMovie>(environment.apiUrl + url);
  }

  search(searchQuery: string) {
    const movieSearch = this.http.get<FetchMovie>(environment.apiUrl + `/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=1`);
    const tvShowSearch = this.http.get(environment.apiUrl + `/search/tv?query=${searchQuery}&include_adult=false&language=en-US&page=1`);

    const sources = [movieSearch, tvShowSearch];

    return forkJoin(sources);
  }
}

function sortByQuery(queries: Params) {
  const transformSortString: { [index: string]: any } = {
    'newest': 'primary_release_date.desc',
    'popularity': 'popularity.desc',
    'most rated': 'vote_count.desc'
  }

  const sortByQuery: string = queries['sortBy'] !== undefined ? queries['sortBy'] : 'popularity';
  const transformSortCriteria = transformSortString[sortByQuery];

  return `&sort_by=${transformSortCriteria}`;
}

function searchByYearQuery(queries: Params, type: string, endpoint: string) {
  const minYear = queries['minYear'] || '';
  const maxYear = queries['maxYear'] || '';

  if (endpoint === 'upcoming' || endpoint === 'now-playing' || endpoint === 'airing-today' || endpoint === 'on-the-air') {
    return false;
  }

  return type === 'tv' ? `&first_air_date.gte=${minYear}&first_air_date.lte=${maxYear}` : `&release_date.gte=${minYear}&release_date.lte=${maxYear}`
}