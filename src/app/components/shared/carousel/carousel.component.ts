import { Component, ElementRef, Input, ViewChild } from "@angular/core"
import { Movie } from "../../../types/movie.type";

@Component({
    selector: 'app-carousel',
    templateUrl: 'carousel.component.html',
    styleUrl: 'carousel.component.css'
})
export class CarouselComponent {
    @ViewChild('sliderContent') sliderContent: ElementRef | undefined;
    @Input() slides!: Movie[];
    isLoading: boolean = true;
    currentSlide: number = 1;
    slidersCount: number = 10;

    slideLeft() {
        if (this.sliderContent !== undefined) {
            if (this.currentSlide <= 1) {
                this.currentSlide = 4;
            }
            this.sliderContent.nativeElement.style.transform = `translateX(${(this.currentSlide * -100) + 200}%)`
            this.currentSlide--
        }
    }

    slideRight() {
        if (this.sliderContent !== undefined) {
            if (this.currentSlide >= this.slidersCount) {
                this.currentSlide = 0;
            }
            this.sliderContent.nativeElement.style.transform = `translateX(${this.currentSlide * -100}%)`
            this.currentSlide++
        }
    }
}