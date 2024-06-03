import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { QueryParamsService } from '../../../services/query-params.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrl: './range-slider.component.css'
})
export class RangeSliderComponent implements OnInit, OnDestroy {
  @ViewChild('leftThumb') leftThumb!: ElementRef;
  @ViewChild('rightThumb') rightThumb!: ElementRef;
  @ViewChild('wrapper') wrapper!: ElementRef;
  @ViewChild('backgroundSlider') backgroundSlider!: ElementRef;

  isDraggable: boolean = false;
  isLeftThumbDraggable: boolean = false;
  isRightThumbDraggable: boolean = false;

  @Input() minValue!: number;
  @Input() maxValue!: number;

  minSlider!: number;
  maxSlider!: number;

  observable!: Observable<Params>;
  subscription!: Subscription;

  constructor(private renderer: Renderer2, private queryService: QueryParamsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.observable = this.route.params;
  }

  ngAfterViewInit(): void {
    this.subscription = this.observable.subscribe(param => {
      this.resetSlider();
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.isDraggable) {
      this.updateQuery();
      this.isDraggable = false;
      this.isLeftThumbDraggable = false;
      this.isRightThumbDraggable = false;
    }
  }

  @HostListener('document:touchend', ['event'])
  onTouchEnd(event: TouchEvent) {
    if (this.isDraggable) {
      this.updateQuery();
      this.isDraggable = false;
      this.isLeftThumbDraggable = false;
      this.isRightThumbDraggable = false;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  mousemove(event: MouseEvent) {
    if (this.isDraggable) {
      this.slider(event.clientX, this.leftThumb, this.rightThumb, this.wrapper);
    }
  }

  @HostListener('document:touchmove', ['$event'])
  touchmove(event: TouchEvent) {
    this.slider(event.touches[0].clientX, this.leftThumb, this.rightThumb, this.wrapper);
  }

  mouseClick(thumb: string) {
    this.isDraggable = true;
    thumb === 'left' ? this.isLeftThumbDraggable = true : this.isRightThumbDraggable = true;
  }

  slider(eventClientX: number, leftThumb: ElementRef, rightThumb: ElementRef, wrapper: ElementRef) {
    const rightThumbRect = rightThumb.nativeElement.getBoundingClientRect();
    const leftThumbRect = leftThumb.nativeElement.getBoundingClientRect();

    const rightThumbPosition = rightThumbRect.x;
    const leftThumbPosition = leftThumbRect.x;

    const sliderWidth = this.calcSliderWidth(rightThumbPosition);
    const rangeSliderLeft = Math.abs(((leftThumbPosition - wrapper.nativeElement.getBoundingClientRect().x + 10) / wrapper.nativeElement.getBoundingClientRect().width * 100));

    if (this.isDraggable) {
      if (this.isLeftThumbDraggable) {

        const rightThumbPosition = rightThumbRect.right - (rightThumbRect.width / 1.3);
        const clientX = eventClientX >= rightThumbPosition ? rightThumbPosition : eventClientX
        const offset = this.calcOffset(wrapper, clientX);
        const value = this.calcYearSlide(offset);

        this.makeLastTouchedThumbSlidableOnCollision(101, 100);
        this.slide(leftThumb, offset, sliderWidth, rangeSliderLeft);
        this.renderRangeValue('min', value);

      } else if (this.isRightThumbDraggable) {

        const leftThumbPosition = leftThumbRect.left + (leftThumbRect.width / 3.5);
        const clientX = eventClientX <= leftThumbPosition ? leftThumbPosition : eventClientX
        const offset = this.calcOffset(wrapper, clientX);
        const value = this.calcYearSlide(offset);

        this.makeLastTouchedThumbSlidableOnCollision(100, 101);
        this.slide(rightThumb, offset, sliderWidth);
        this.renderRangeValue('max', value);
      }
    }
  }

  updateQuery() {
    this.queryService.updateQuery({
      minYear: this.minSlider,
      maxYear: this.maxSlider
    })
  }

  slide(thumb: ElementRef, offset: number, sliderWidth: number, slideLeft?: number) {
    this.slideThumb(thumb, offset);
    this.sliderRange(sliderWidth, slideLeft);
  }

  slideToPosition(event: MouseEvent) {
    const clientX = event.clientX;
    const offset = this.calcOffset(this.wrapper, clientX);
    const leftPosition = Number(parseFloat(this.leftThumb.nativeElement.style.left));
    const leftThumbPosition = this.leftThumb.nativeElement.getBoundingClientRect().left;

    this.makeLastTouchedThumbSlidableOnCollision(100, 101);

    if (offset <= leftPosition) {
      this.renderRangeValue('max', this.calcYearSlide(leftPosition));
      this.slide(this.rightThumb, leftPosition, this.calcSliderWidth(leftThumbPosition));
      this.updateQuery();
    } else {
      this.renderRangeValue('max', this.calcYearSlide(offset));
      this.slide(this.rightThumb, offset, this.calcSliderWidth(clientX));
      this.updateQuery();
    }
  }

  slideThumb(thumb: ElementRef, offset: number) {
    this.renderer.setStyle(thumb.nativeElement, 'left', `${offset}%`);
  }

  sliderRange(sliderWidth: number, slideLeft?: number) {
    this.renderer.setStyle(this.backgroundSlider.nativeElement, 'width', `${sliderWidth}%`);
    this.renderer.setStyle(this.backgroundSlider.nativeElement, 'left', `${slideLeft}%`);
  }

  renderRangeValue(range: 'min' | 'max', value: number) {
    range === 'min' ? this.minSlider = value : this.maxSlider = value;
  }

  calcOffset(wrapper: ElementRef, thumbPosition: number) {
    const wrapperRect = wrapper.nativeElement.getBoundingClientRect();
    const clientPosition = Math.abs(wrapperRect.left - thumbPosition);

    const offsetPosition = (clientPosition / wrapperRect.width) * 100;
    const offset = Math.max(0, Math.min(100, offsetPosition));

    return thumbPosition < wrapperRect.left ? 0 : offset;
  }

  calcYearSlide(offset: number) {
    return parseInt(String((offset / 100) * (this.maxValue - this.minValue) + this.minValue));
  }

  calcSliderWidth(thumb: number) {
    const leftThumbPosition = this.leftThumb.nativeElement.getBoundingClientRect().left;
    const wrapperWidth = this.wrapper.nativeElement.getBoundingClientRect().width;

    const sliderWidth = (thumb - leftThumbPosition) / wrapperWidth * 100;

    if (sliderWidth <= 0) {
      return 0;
    }

    return sliderWidth;
  }

  makeLastTouchedThumbSlidableOnCollision(left: number, right: number) {
    this.renderer.setStyle(this.leftThumb.nativeElement, 'z-index', left);
    this.renderer.setStyle(this.rightThumb.nativeElement, 'z-index', right);
  }

  resetSlider() {
    this.minSlider = this.minValue;
    this.maxSlider = this.maxValue;

    this.renderer.setStyle(this.leftThumb.nativeElement, 'left', '0');
    this.renderer.setStyle(this.rightThumb.nativeElement, 'left', '100%');
    this.renderer.setStyle(this.backgroundSlider.nativeElement, 'left', '0');
    this.renderer.setStyle(this.backgroundSlider.nativeElement, 'width', '100%');
  }
}