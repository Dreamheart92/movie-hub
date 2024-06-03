import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Directive({
  standalone: true,
  selector: '[appLoading]'
})
export class LoadingDirective implements OnChanges {
  @Input() appLoading: boolean = true;

  constructor(private el: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('appLoading')) {
      const loading = changes['appLoading'].currentValue;

      if (!loading) {
        this.el.nativeElement.classList.remove('placeholder-text');
      }
    }
  }
}
