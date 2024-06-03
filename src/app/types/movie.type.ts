import { Cast, Crew } from "./credits.type"

export interface Movie {
  "backdrop_path": string,
  "title": string,
  "poster_path": string,
  "id": number,
  "overview": string,
  "tagline": string,
  "credits": {
    "cast": Cast[],
    "crew": Crew[]
  },
  "release_date": string,
  "vote_average": number,
  "genre_ids": string[],
  "genresNames": {
    name: string,
    id: string
  }[],
  "genres": Genre[],
  "videos": {
    "results": [{
      "key": string,
      "name": string,
      "type": string
    }]
  },
  "runtime": number,
  "budget": number,
  "revenue": number,
  "production_countries": [
    {
      "iso_3166_1": string,
      "name": string
    }
  ],
  "spoken_languages": [
    {
      "english_name": string,
      "iso_369_1": string,
      "name": string
    }
  ],
  "keywords": {
    "keywords": [
      {
        "id": number,
        "name": string
      }
    ]
  },
  "name": string,
  "first_air_date": string,
}

export interface Genres {
  genres: [{
    "id": string,
    "name": string,
    "selected": boolean
  }]
}

export interface Genre {
  "id": string,
  "name": string,
  "selected": boolean
}