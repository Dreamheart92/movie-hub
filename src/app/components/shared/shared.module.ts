import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter/filter.component';
import { PaginationComponent } from './pagination/pagination.component';
import { RangeSliderComponent } from './range-slider/range-slider.component';
import { CarouselComponent } from './carousel/carousel.component';
import { RouterModule } from '@angular/router';
import { TagComponent } from './tag/tag.component';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { SliceTextWithPeriods } from '../../pipes/slice-text-with-periods.pipe';
import { SpinnerComponent } from './spinner/spinner.component';
import { PopoverComponent } from './popover/popover.component';

@NgModule({
  declarations: [
    MovieCardComponent,
    FilterComponent,
    PaginationComponent,
    RangeSliderComponent,
    CarouselComponent,
    TagComponent,
    SearchComponent,
    SpinnerComponent,
    PopoverComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SliceTextWithPeriods
  ],
  exports: [MovieCardComponent,
    FilterComponent,
    PaginationComponent,
    RangeSliderComponent,
    CarouselComponent,
    TagComponent,
    SearchComponent,
    SpinnerComponent,
    PopoverComponent
  ]
})
export class SharedModule { }
