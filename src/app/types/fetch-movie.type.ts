import { Movie } from "./movie.type";

export interface FetchMovie {
  "results": Movie[],
  "page": number,
  "total_pages": number
}
