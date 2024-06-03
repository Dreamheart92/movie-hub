import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.css'
})
export class PopoverComponent {
  @Input() string!: string;
}
