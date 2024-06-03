import { Injectable } from "@angular/core";
import { Crew } from "../../../../types/credits.type";
import moment from "moment";
import { Genre } from "../../../../types/movie.type";

@Injectable({
    providedIn: 'root'
})
export class MovieUtilityService {
    findDirector(crew: Crew[]): string | undefined {
        return crew.find(crew => crew.job === 'Director')?.name;
    }

    getTrailer(videos: [{ "type": string, "key": string }]) {
        return videos.find(video => video.type === 'Trailer')?.key;
    }

    usDollarFormater() {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        })
    }

    convertRuntime(time: number) {
        const momentDuration = moment.duration(time, 'minutes');
        return momentDuration.hours() + 'h ' + momentDuration.minutes() + 'm';
    }

    getGenresNames(genres: Genre[]) {
        return genres.map(genre => genre.name);
    }
}   