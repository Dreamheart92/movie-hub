import { Movie } from "./movie.type"

export interface User {
    username: string
    email: string,
    watchlist: Movie[],
    likedMovies: number[],
    uid: string
}