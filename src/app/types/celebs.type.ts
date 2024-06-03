export interface Celebs {
    "id": number,
    "name": string,
    "profile_path": string,
    "known_for": {
        "backdrop_path": string,
        "title": string,
        "name": string,
        "poster_path": string,
        "media_type": string
    }[]
}

export interface Celeb {
    "also_known_as": string[],
    "biography": string,
    "birthday": string,
    "deathday": string | null,
    "id": number,
    "known_for_department": string,
    "name": string,
    "place_of_birth": string,
    "profile_path": string,
    "movie_credits": {
        "cast": CastCredits[]
    },
    "tv_credits": {
        "cast": TvCredits[]
    }
}

export interface TvCredits {
    "character": string,
    "first_air_date": string,
    "name": string,
    "vote_average": number,
    "id": number
}

export interface CastCredits {
    "popularity": number,
    "title": string,
    "vote_count": number,
    "poster_path": string,
    "id": number,
    "character": string,
    "vote_average": number,
    "release_date": string
}