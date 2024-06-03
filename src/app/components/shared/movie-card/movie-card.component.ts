import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Movie } from '../../../types/movie.type';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() type!: string;
  @Input() imgSize: {
    width: string,
    height: string
  } = {
      width: '9em',
      height: '10em'
    }

  movieContentTextSize: number = window.outerWidth <= 600 ? 100 : 250;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.outerWidth <= 600) {
      this.movieContentTextSize = 100;
    } else if (window.outerWidth > 600) {
      this.movieContentTextSize = 250;
    }
  }


  determineColorBasedOnUserRating(rating: number) {
    const backgroundColor = rating >= 6.5 ? '#27ae60' : rating >= 5 ? '#ffbd3f' : '#ff4c30'
    return {
      backgroundColor
    }
  }
}