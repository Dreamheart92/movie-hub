import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild, computed, signal } from "@angular/core";
import { Movie } from "../../../../types/movie.type";
import { BehaviorSubject } from "rxjs";

@Component({
    selector: 'app-movies-categories',
    templateUrl: 'movies-categories.html',
    styleUrl: 'movies-categories.css'
})
export class MoviesCategoriesComponent implements OnInit {
    @ViewChild('wrapper') wrapper!: ElementRef;
    @ViewChild('carousel') carousel!: ElementRef;

    @Input() movies!: Movie[];
    @Input() category!: string;
    @Input() url!: string;
    @Input() queryParams!: object;
    @Input() type!: string;

    urlPath!: string;
    width: string = '8.5em';
    screenWidth = signal(window.innerWidth);

    slidersCount = computed(() => {
        return this.screenWidth() > 1400 ? 8 : this?.movies?.length
    })

    @HostListener('window:resize')
    onResize() {
        this.screenWidth.set(window.innerWidth);
    }

    constructor(private render: Renderer2) { }

    ngOnInit(): void {
        this.urlPath = this.type === 'movies' ? 'movie' : 'tv'
    }

    onMouseEnter(card: HTMLElement, poster: HTMLElement, backdrop: HTMLElement, blank: HTMLElement) {
        if (Number(card['id']) === 7) {
            this.render.setStyle(blank, 'width', 0);
        }
        this.render.setStyle(card, 'width', '17.5em');
        this.render.setStyle(backdrop, 'display', 'block');
        this.render.setStyle(poster, 'display', 'none');
    }

    onMouseLeave(card: HTMLElement, poster: HTMLElement, backdrop: HTMLElement, blank: HTMLElement) {
        this.render.setStyle(blank, 'width', this.width);
        this.render.setStyle(card, 'width', this.width);
        this.render.setStyle(backdrop, 'display', 'none');
        this.render.setStyle(poster, 'display', 'block');
    }
}