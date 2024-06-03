import { Movie } from "./movie.type"

export interface TV extends Movie {
    "created_by": [
        {
            name: string
        }
    ],
    "first_air_date": string,
    "name": string,
    "last_episode_to_air": {
        "runtime": number
    },
    "number_of_episodes": number,
    "number_of_seasons": number
}